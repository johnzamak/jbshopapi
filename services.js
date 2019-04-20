const moment = require('moment')
const log = require('log-to-file');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('TMSZfeotrtDapSloufst');
var fs = require("fs");
const mysql = require('mysql')

const sql_functions = {
    sql_select(dbConfig, nameTB = "", nameFN = "", sqlQuery = "") {
        return new Promise((resolve, reject) => {
            mysql.close()
            const pool = new mysql.ConnectionPool(dbConfig)
            pool.connect(err => {
                if (err) {
                    save_log(pool, nameFN, nameTB, err)
                    reject(response(500, "Error Connection", err))
                }
                var req = new mysql.Request(pool)
                req.query(sqlQuery).then((result) => {
                    console.log("sqlQuery", sqlQuery)
                    pool.close()
                    if (result.recordset.length > 0) {
                        save_log(sqlQuery, nameFN, nameTB, result.recordset)
                        resolve(response(200, "Success", result.recordset))
                    } else {
                        save_log(sqlQuery, nameFN, nameTB, result.recordset)
                        resolve(response(502, "Error Data", result))
                    }
                }).catch((err) => {
                    pool.close()
                    if (err) {
                        save_log(sqlQuery, nameFN, nameTB, err)
                        reject(response(501, "Error Query", err))
                    }
                });
            })
        })
    },
    sql_insert(dbConfig, nameTB = "", nameFN = "", sqlQuery = "") {
        return new Promise((resolve, reject) => {
            mysql.close()
            const pool = new mysql.ConnectionPool(dbConfig)
            pool.connect(err => {
                if (err) {
                    save_log(pool, nameFN, nameTB, err)
                    reject(response(500, "Error Connection", err))
                }
                const transaction = new mysql.Transaction(pool)
                transaction.begin(err => {
                    if (err) {
                        save_log(transaction, nameFN, nameTB, err)
                        reject(response(500, "Connection is close", err))
                    }
                    let rolledBack = false
                    transaction.on("rollback", aborted => {
                        rolledBack = true
                    })
                    var req = new mysql.Request(transaction)
                    // console.log("sqlQuery",sqlQuery)
                    req.query(sqlQuery).then((result, err) => {
                        if (err) {
                            if (!rolledBack) {
                                transaction.rollback(err => {
                                    pool.close()
                                    if (err) {
                                        save_log(transaction, nameFN, nameTB, err)
                                        reject(response(501, "Error query SQL No Rollback", err))
                                    }
                                    save_log(transaction, nameFN, nameTB, err)
                                    reject(response(502, "Error query SQL to Rollback", err))
                                })
                            }
                        } else {
                            transaction.commit(err => {
                                pool.close()
                                if (err) {
                                    save_log(transaction, nameFN, nameTB, err)
                                    reject(response(503, "Error query SQL No Commit", err))
                                }
                                save_log(transaction, nameFN, nameTB, result.recordset)
                                resolve(response(200, "Success", result.recordset))
                            })
                        }
                    }).catch((err) => {
                        if (err) {
                            save_log(err, nameFN, nameTB, err)
                            reject(response(504, "Error query SQL", err))
                        }
                    });
                })
            })
        })
    }
}
const save_log = (res_data, type, tbl_name, input_data) => {
    //-----Parameter 
    //-----1. res_data = ข้อมูลตอบกลับหลังทำงานเสร็จ เช่น ข้อมูลที่ดึงได้จากระบบ
    //-----2. type = ประเภทของการทำงาน เช่น Insert, Select, Update
    //-----3. tbl_name = ชื่อของตารางที่เกี่ยวข้อง
    //-----4. input_data = ข้อมูลที่นำเข้ามา

    Check_Log_file("log-server.txt")

    if (Array.isArray(res_data)) {
        res_data.forEach((val, index) => {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(input_data[index]), "log-server.txt")
        });
    } else {
        // console.log(input_data.length);
        if (Array.isArray(input_data)) {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(input_data[0]), "log-server.txt")
        } else {
            const lognow = moment().format("YYYY-MM-DD H:m:s")
            log(lognow + " :: " + type + " " + tbl_name + " :: " + JSON.stringify(input_data), "log-server.txt")
        }
    }
}
function Check_Log_file(pathfile) {
    //Load the filesystem module
    var stats = fs.statSync(pathfile)
    var fileSizeInBytes = stats["size"]
    //Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
    // console.log("object", fileSizeInMegabytes)
    if (fileSizeInMegabytes > 5) {
        fs.writeFile(pathfile, '', function () { console.log('done') })
        // fs.unlink('log-server-send-Email.txt', function (err) {
        //     if (err) throw err;
        //     console.log('File deleted!');
        //   });
    }
}
const public_functions = {
    gen_document(digit = 5, char_doc = "", last_doc = "") {
        let new_doc = "", document = ""
        let docYear = moment().format("YY")
        let docMonth = moment().format("MM")
        let docDate = moment().format("DD")
        last_doc = (typeof last_doc == "undefined") ? "" : last_doc
        // console.log("last_doc", last_doc)
        if (last_doc != "") {
            get_number_run = last_doc.split("-");
            get_number_run = get_number_run[1]
            get_number_run++
            if (get_number_run < 10) {
                new_doc = "0000" + get_number_run
            } else if (get_number_run < 100) {
                new_doc = "000" + get_number_run
            } else if (get_number_run < 1000) {
                new_doc = "00" + get_number_run
            } else if (get_number_run < 10000) {
                new_doc = "0" + get_number_run
            } else {
                new_doc = get_number_run
            }
            document = char_doc + docYear + docMonth + docDate + "-" + new_doc
        } else {
            document = char_doc + docYear + docMonth + docDate + "-00001"
        }
        return document
    },
    set_encryption(str_data) {
        return new Promise((resolve) => {
            var encrypt_str = cryptr.encrypt(str_data)
            resolve(encrypt_str)
        })
    },
    get_decryption(str_data) {
        return new Promise((resolve) => {
            var decrypt_str = cryptr.decrypt(str_data)
            resolve(decrypt_str)
        })
    },
    response(status, dev_msg, data) {
        switch (status) {
            case 200: return { status: 200, message: "OK", dev_msg: dev_msg, result: data }
            case 201: return { status: 201, message: "Created", dev_msg: dev_msg, result: data }
            case 202: return { status: 202, message: "Accepted", dev_msg: dev_msg, result: data }
            case 203: return { status: 203, message: "Non-Authoritative Information", dev_msg: dev_msg, result: data }
            case 204: return { status: 204, message: "No Content", dev_msg: dev_msg, result: data }
            case 205: return { status: 205, message: "Reset Content", dev_msg: dev_msg, result: data }
            case 206: return { status: 206, message: "Partial Content", dev_msg: dev_msg, result: data }

            case 300: return { status: 300, message: "Multiple Choice", dev_msg: dev_msg, result: data }
            case 301: return { status: 301, message: "Moved Permanently", dev_msg: dev_msg, result: data }
            case 302: return { status: 302, message: "Found", dev_msg: dev_msg, result: data }
            case 303: return { status: 303, message: "See Other", dev_msg: dev_msg, result: data }
            case 304: return { status: 304, message: "Not Modified", dev_msg: dev_msg, result: data }

            case 400: return { status: 400, message: "Bad Request", dev_msg: dev_msg, result: data }
            case 401: return { status: 401, message: "Unauthorized", dev_msg: dev_msg, result: data }
            case 402: return { status: 402, message: "Payment Required", dev_msg: dev_msg, result: data }
            case 403: return { status: 403, message: "Forbidden", dev_msg: dev_msg, result: data }
            case 404: return { status: 404, message: "Not Found", dev_msg: dev_msg, result: data }
            case 405: return { status: 405, message: "Method Not Allowed", dev_msg: dev_msg, result: data }
            case 406: return { status: 406, message: "Not Acceptable", dev_msg: dev_msg, result: data }
            case 413: return { status: 413, message: "Request Entity Too Large", dev_msg: dev_msg, result: data }
            case 414: return { status: 414, message: "Request-URI Too Long", dev_msg: dev_msg, result: data }
            case 415: return { status: 415, message: "Unsupported Media Type", dev_msg: dev_msg, result: data }

            case 500: return { status: 500, message: "Internal Server Error", dev_msg: dev_msg, result: data }
            case 501: return { status: 501, message: "Not Implemented", dev_msg: dev_msg, result: data }
            case 502: return { status: 502, message: "Bad Gateway", dev_msg: dev_msg, result: data }
            case 503: return { status: 503, message: "Service Unavailable", dev_msg: dev_msg, result: data }
            case 504: return { status: 504, message: "Gateway Timeout", dev_msg: dev_msg, result: data }
        }
    }
}

module.exports = {
    sqlQuery: sql_functions,
    fnPublic: public_functions
}
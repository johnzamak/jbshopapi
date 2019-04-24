const mysql = require('mysql')
const moment = require('moment')
const { connMyDB } = require("../../config")
const { sqlQuery, fnPublic } = require("../../services")
var sql_select, sql_insert, sql_update, nameTB, nameFN, sql_values

const model = {
    async find_by_doc(inDoc, callback) {
        var doc_digit = inDoc
        nameFN = "find_by_doc"
        nameTB = "doc_master"
        sql_select = "SELECT doc_last FROM doc_master WHERE doc_digit LIKE '" + doc_digit + "' "
        var res_docLast = await sqlQuery.sql_select(connMyDB, nameTB, nameFN, sql_select)
        if (res_docLast.status == 200) {
            var new_doc = fnPublic.gen_document('', doc_digit, res_docLast.result[0].doc_last)
            sql_update = "UPDATE doc_master SET doc_last='" + new_doc + "' WHERE doc_digit LIKE '" + doc_digit + "' "
            var res_update = await sqlQuery.sql_insert(connMyDB, nameTB, nameFN, sql_update)
            if (res_update.status == 200) {
                callback(new_doc)
            } else {
                callback(fnPublic.response(500, "Error", ""))
            }
        } else {
            callback(fnPublic.response(500, "Error", ""))
        }
    },
    async create_item_tran(newDoc, inData, callback) {
        nameFN = "find_by_doc"
        nameTB = "doc_master"
        inData.forEach((val, i) => {
            if (i + 1 == inData.length) {
                sql_values = "( '" + newDoc + "','" + val.item_id + "','" + val.barcode + "','" + val.type_tran + "','" + val.item_name + "','" + val.item_price + "','" + val.item_qty + "','" + val.price + "',\
                '"+ val.discount + "','" + dateNow + "','" + val.user_login + "','" + val.item_unit + "' )"
            } else {
                sql_values = "( '" + newDoc + "','" + val.item_id + "','" + val.barcode + "','" + val.type_tran + "','" + val.item_name + "','" + val.item_price + "','" + val.item_qty + "','" + val.price + "',\
                '"+ val.discount + "','" + dateNow + "','" + val.user_login + "','" + val.item_unit + "' ),"
            }
        });
        sql_insert = "INSERT INTO item_tran \
        (doc_no \
        ,item_id \
        ,barcode \
        ,type_tran \
        ,item_name \
        ,item_price \
        ,item_qty \
        ,price \
        ,discount \
        ,create_date \
        ,user_create \
        ,item_unit) \
        VALUES"+ sql_values
        var res_insert = await sqlQuery.sql_insert(connMyDB, nameTB, nameFN, sql_insert)
        callback(res_insert)
    },
    async search_item(inData, callback) {
        nameFN = "search_item"
        nameTB = "item_master"
        sql_select = "SELECT TOP(10) *,`id`+`barcode`+`item_name` as search FROM `item_master` WHERE `id`+`barcode`+`item_name` LIKE '%" + inData + "%'"
        var res_select = await sqlQuery.sql_select(connMyDB, nameTB, nameFN, sql_select)
        callback(res_select)
    },
    async find_all_item(callback){
        nameFN = "find_all"
        nameTB = "item_master"
        sql_select = "SELECT *,`id`+`barcode`+`item_name` as search FROM `item_master`"
        var res_select = await sqlQuery.sql_select(connMyDB, nameTB, nameFN, sql_select)
        callback(res_select)
    },
}
module.exports = {
    model: model
}
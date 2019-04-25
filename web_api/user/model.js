const moment = require('moment')
const { connMyDB } = require("../../config")
const { sqlQuery, fnPublic } = require("../../services")
var sql_select, sql_insert, sql_update, nameTB, nameFN, sql_values

const model = {
    async login_username(inUsername, inPassword, callback) {
        nameFN = "login_username"
        nameTB = "username"
        inPassword = await fnPublic.set_encryption(inPassword)
        sql_select = "SELECT * FROM user WHERE username LIKE '" + inUsername + "' AND password LIKE '" + inPassword + "' "
        var res_login = await sqlQuery.sql_select(connMyDB, nameTB, nameFN, sql_select)
        callback(res_login)
    },
}
module.exports = {
    model: model
}
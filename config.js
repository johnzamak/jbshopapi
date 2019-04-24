require('dotenv').config()

const connect_db={
    host:process.env.HOST_DOMAIN,
    user:process.env.USER_CONN,
    password:process.env.PASS_CONN,
    database:process.env.DATABASE_NAME,
    queueLimit : 0,
    connectionLimit : 99999999, 
    multipleStatements: true,
}
const conFocusrewards={
    host:"150.95.26.68",
    user:"focusrewards",
    password:"bS#x7u79",
    database:"focusrewards",
    queueLimit : 0,
    connectionLimit : 99999999, 
    multipleStatements: true,
}
const connect_myDB={
    host:"localhost",
    user:"admin_web",
    password:"xOqPXVmWVb9WLEVe",
    // password:"jbShop2728JBShop",
    database:"jbshop",
    // port:"3306",
    queueLimit : 0,
    connectionLimit : 99999999, 
    multipleStatements: true,
}

module.exports={
    port:process.env.PORT,
    connDB:connect_db,
    connMyDB:connect_myDB
}
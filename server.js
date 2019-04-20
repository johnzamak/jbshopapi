const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const config = require("./config")

const app = express()
const PORT = config.port

var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 2000, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' })



function fnCallback(text, time, callback) {
    setTimeout(() => callback("function " + text), time)
}
function fnPromise(text, time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("function " + text), time)
    })
}

async function test() {
    /*
    fnCallback("A", 1000, (res) => {
        console.log("Callback1", res)
        fnCallback("B", 1000, (res) => {
            console.log("Callback1", res)
            fnCallback("C", 1000, (res) => console.log("Callback1", res))
        })
    })
    */

    /*
    console.log(fnPromise("B", 3000));
    fnPromise("B", 1000).then(result => {
        console.log("Promise1", result);
        return result+"test"
    }).then((result)=>{
        console.log("Promise1", result);
    })
    */

    /*
    var fnAsync1 = await fnPromise("A", 1000)
    console.log(fnAsync1);
    fnAsync1 = await fnPromise("B ", 3000)
    console.log(fnAsync1);
    fnAsync1 = await fnPromise("C ", 1000)
    console.log(fnAsync1);
    var fnAsync1 = await Promise.all([fnPromise("A", 1000),fnPromise("B", 3000)])
    console.log(fnAsync1);
    */
}
test()
var setup_routes = () => {
    let API_DIR = `${__dirname}/`
    const API_FEATURES = fs.readdirSync(API_DIR).filter(
        forder => fs.statSync(`${API_DIR}/${forder}`).isDirectory()
    )
    API_FEATURES.forEach(API_FEATURES => {
        const API_DIR_FEATURES = `${API_DIR}${API_FEATURES}`
        switch (API_FEATURES) {
            case "web_api":
                _setupRoutes(API_DIR_FEATURES)
                break;
            case "app_api":
                _setupRoutes(API_DIR_FEATURES)
                break;
        }
    })
}
_setupRoutes = (API_DIR_FEATURES, ) => {
    const features = fs.readdirSync(API_DIR_FEATURES).filter(
        file => fs.statSync(`${API_DIR_FEATURES}/${file}`).isDirectory()
    )
    features.forEach(features => {
        const router = express.Router()
        const routes = require(`${API_DIR_FEATURES}/${features}/routes.js`)
        // console.log("object",`${API_DIR_FEATURES}/${features}/routes.js`)
        routes.setup(router)
        app.use(`/${features}`, router)
    })
}
var setup = () => {
    app.use(cors())
    app.use(jsonParser);
    app.use(urlencodedParser);

    setup_routes(app)

    // app.get('/', (req, res) => {
    //     res.send("test")
    // })

    app.listen(PORT, () => {
        console.log('ready on http://localhost:' + PORT)
    });
}
module.exports = {
    setup: setup
}
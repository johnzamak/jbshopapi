const { Controller } = require("./controller")

var setup = (router) => {
    router
        // .get("/:code", Controller.get_by_id)
        .get("/", Controller.get_all_item)
        .post("/sell-item/", Controller.create_item_tran)
}
module.exports = {
    setup: setup
}
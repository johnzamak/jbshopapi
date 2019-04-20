const {model} = require("./model")

const Controller = {
    getAll(req, res) {
        res.json({status:true})
        // model.findAll((res_data) => {
        //     res.json(res_data)
        // })
    },
    get_by_id(req, resp) {
        // model.find_by_code(req.params.code, (res_data) => {
        //     res.json(res_data)
        // })
    },
    create_item_tran(req, resp) {
        model.find_by_doc("SO",(res_newDoc)=>{
            model.create_item_tran(res_newDoc,req.body,(res_data)=>{
                resp.json(res_data)
            })
        })
    }
}
module.exports = {
    Controller: Controller
}
const {model} = require("./model")

const Controller = {
    get_all_item(req, resp) {
        model.find_all_item((res_data)=>resp.json(res_data))
    },
    get_search_item(req, resp) {
        model.search_item(req.params.inData,(res_data)=>resp.json(res_data))
    },
    get_item_one(req,resp){
        model.search_item(req.params.inItem,(res_data)=>resp.json(res_data))
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
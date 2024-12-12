const { RgstrAgntService } = require("../Services")
class CragntController {
    async createagent(req, res, next) {
       console.log("ok");
        try {
            await RgstrAgntService.AgentCreate(req, res, next)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json("error")
        }
    }

}
module.exports = new CragntController()
const { ShowAgntService } = require("../Services")
class ShwagntController {
    async showagent(req, res, next) {
       console.log("ok");
        try {
            await ShowAgntService.AgentShow(req, res, next)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json("error")
        }
    }

}
module.exports = new ShwagntController()
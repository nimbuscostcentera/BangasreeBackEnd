const { ShowCustService } = require("../Services")
class ShwcustController {
    async showcustomer(req, res, next) {
       console.log("ok");
        try {
            await ShowCustService.CustomerShow(req, res, next)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json("error")
        }
    }

}
module.exports = new ShwcustController()
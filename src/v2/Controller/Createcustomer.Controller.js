const { RgstrCustService } = require("../Services")
class CrcustController {
    async createcust(req, res, next) {
       console.log("ok");
        try {
            await RgstrCustService.CustomerCreate(req, res, next)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json("error")
        }
    }

}
module.exports = new CrcustController()
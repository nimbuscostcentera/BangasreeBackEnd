
const { LoginService } = require("../Services")
class LoginController {
    async securelogin(req, res, next) {
        try {
            await LoginService.getlogin(req, res, next)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json("error")
        }
    }

    async registration(req, res, next) {
        try {
            await LoginService.registration(req, res, next)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json("error")
        }
    }
}
module.exports = new LoginController()
const { UserShowService,UserPermissonService } = require("../Services/index");
class UserController {
  async showuser(req, res, next) {
    console.log(req);

    try {
      const getUserResponse = await UserShowService.UserShow(req, res, next);
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async permissonuser(req, res, next) {
    console.log(req);

    try {
      const getUserResponse = await UserPermissonService.UserPermisson(req, res, next);
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

 

}
module.exports = new UserController()
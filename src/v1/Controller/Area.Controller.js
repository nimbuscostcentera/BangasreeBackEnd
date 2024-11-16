const { AreaShowService } = require("../Services/index");
class AreaController {
  async showarea(req, res, next) {
    try {
      const getAreaResponse = await AreaShowService.AreaShow(req, res, next);
      next();
      return getAreaResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
}
module.exports = new AreaController()
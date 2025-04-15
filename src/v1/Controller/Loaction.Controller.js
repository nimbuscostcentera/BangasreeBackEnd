const { LocationShowService } = require("../Services/index");
class LoactionController {
  async showlocation(req, res, next) {
    try {
      const getLoactionResponse = await LocationShowService.LocationSearch(req, res, next);
      next();
      return getLoactionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

}
module.exports = new LoactionController()
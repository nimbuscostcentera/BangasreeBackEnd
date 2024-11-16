const { NotificationSendService,NotificationShowService,NotificationUpdateService } = require("../Services/index");
class NotificationController {
  async sendnottification(req, res, next) {
    try {
      const getAreaResponse = await NotificationSendService.NotificationSend(req, res, next);
      next();
      return getAreaResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async shownottification(req, res, next) {
    try {
      const getAreaResponse = await NotificationShowService.NotificationShow(req, res, next);
      next();
      return getAreaResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async readnottification(req, res, next) {
    try {
      const getAreaResponse = await NotificationUpdateService.NotificationRead(req, res, next);
      next();
      return getAreaResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
}
module.exports = new NotificationController()
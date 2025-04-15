const { LoginService } = require("../Services");
const { AgentRegService } = require("../Services/index");
const { CustomerRegService,LeadRegService,SuperRegService } = require("../Services/index");
class AuthController {
  async AgentRegistration(req, res, next) {
    try {
      
      const createAgentResponse = await AgentRegService.AgentReg(req,res,next);
      next();
      return createAgentResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  };
  async securelogin(req, res, next) {
    try {
      const AuthResponse = await LoginService.getlogin(req, res, next);
      next();
      return AuthResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json({ errMsg: "error", response: err });
    }
  }

  async CustomerRegistration(req, res, next) {
    try {
      await CustomerRegService.CustomerReg(req, res, next);
      next();
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  
  async LeadeRegistration(req, res, next) {

    try {
      await LeadRegService.LeadReg(req, res, next);
      next();
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async superuserRegistration(req, res, next) {

    try {
      await SuperRegService.SuperReg(req, res, next);
      next();
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async forgetpass(req, res, next) {
    try {
      const AuthResponse = await LoginService.ForgetPass(req, res, next);
      next();
      return AuthResponse;
      
    } catch (err) {
      console.log(err);
      return res.status(400).json({ errMsg: "error", response: err });
    }
  }
  async resetpass(req, res, next) {
    try {
      const AuthResponse = await LoginService.ResetPass(req, res, next);
      next();
      return AuthResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json({ errMsg: "error", response: err });
    }
  }
}
module.exports = new AuthController();

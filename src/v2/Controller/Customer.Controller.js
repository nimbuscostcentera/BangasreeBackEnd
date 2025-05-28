const {
  CustomerShowService,
  CustomerSerachService,
  CustomerEditService,
  CustDetailPayment,
  CustomerApproveService,
  LaedShowService,
  DopdownCustomerService,
  DopdownSchemeService,
} = require("../Services");
class CustomerController {
  async showcustomer(req, res, next) {
    try {
      const getCustomerResponse = await CustomerShowService.CustomerShow(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async searchcustomer(req, res, next) {
    try {
      const getCustomerResponse = await CustomerSerachService.CustomerSearch(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async updatecustomer(req, res, next) {
    try {
      console.log("controller", req.body);
      const UpdateCustomerResponse = await CustomerEditService.CustomerEdit(
        req,
        res,
        next
      );
      next();
      return UpdateCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async approvecustomer(req, res, next) {
    try {
      console.log("controller1", req.body);
      const ApproveCustomerResponse =
        await CustomerApproveService.CustomerApprove(req, res, next);
        next();
      return ApproveCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async showlead(req, res, next) {
    try {
      const getCustomerResponse = await LaedShowService.LeadShow(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async dropdowncustomer(req, res, next) {
    try {
      const getCustomerResponse = await DopdownCustomerService.DropDownCustomer(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async dropdownscheme(req, res, next) {
    try {
      console.log(req.body, "in controller");
      const getCustomerResponse = await DopdownSchemeService.DropDownScheme(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async custdetailpayment(req, res, next) {
    try {
      console.log(req.body, "in controller");
      const getCustomerResponse = await CustDetailPayment.CustomerPaymentShow(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async monthlypayment(req, res, next) {
    try {
      console.log(req.body, "in controller");
      const getCustomerResponse = await CustDetailPayment.MonthlyPayment(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async walletbalance(req, res, next) {
    try {
      console.log(req.body, "in controller");
      const getCustomerResponse = await CustDetailPayment.WalletBalance(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async totcollection(req, res, next) {
    try {
      console.log(req, "in controller");
      const getCustomerResponse = await CustDetailPayment.TotCollection(
        req,
        res,
        next
      );
      next();
      return getCustomerResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
}
module.exports = new CustomerController();

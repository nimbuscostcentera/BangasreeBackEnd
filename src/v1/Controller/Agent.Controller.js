const {
  AgentShowService,
  AgentSerachService,
  AgentCodeService,
  AgentEditService,
  AgentApproveService,
  AgentByIDService,
  CustomerCollectionService,
  CollectionShowService,
  CollectionSubmissonService,
  SchemeAddCustomerService,
  LeadEditService,
  DashBoardServices,
} = require("../Services/index");
class AgentController {
  async showagent(req, res, next) {
    try {
      const getAgentResponse = await AgentShowService.AgentShow(req, res, next);
      next();
      return getAgentResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async searchagent(req, res, next) {
    try {
      const getAgentResponse = await AgentSerachService.AgentSearch(
        req,
        res,
        next
      );
      next();
      return getAgentResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async showagentcode(req, res, next) {
    try {
      const getAgentResponse = await AgentCodeService.AgentCodeShow(
        req,
        res,
        next
      );
      next();
      return getAgentResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async updateagent(req, res, next) {
    try {
      
      const UpdateAgentResponse = await AgentEditService.AgentEdit(
        req,
        res,
        next
      );
      next();
      return UpdateAgentResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async approveagent(req, res, next) {
    try {
      
      const ApproveAgentResponse = await AgentApproveService.AgentApprove(
        req,
        res,
        next
      );
      next();
      return ApproveAgentResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async getAgentById(req, res, next) {
    try {
      const Resp = await AgentByIDService.getAgentByID(req, res, next);
      next();
      return Resp;
    } catch (err) {
      return res.status(500).json({ errmsg: true, response: err });
    }
  }

  async customercollection(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await CustomerCollectionService.CustomerCollection(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async customercollectionedit(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await CustomerCollectionService.CustomerCollectionEdit(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async customercollectionlist(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await CollectionShowService.CustomerCollectionShow(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async colectionsubmisson(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await CollectionSubmissonService.CollectionSubmission(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async schemeaddcustomer(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await SchemeAddCustomerService.SchemeAddCustomer(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async schemeeditcustomer(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await SchemeAddCustomerService.SchemeEditCustomer(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async schemedeletecustomer(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await SchemeAddCustomerService.SchemeDeleteCustomer(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async updatelead(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse = await LeadEditService.EditLead(
        req,
        res,
        next
      );
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "error" });
    }
  }

  async AgentPerformance(req, res, next) {
    try {
      const db = await DashBoardServices.AgentYearlyReport(req, res, next);
      next();
      return db;
    } catch (err) {
      return res.status(400).json({ msg: "error" });
    }
  }

  async AreaAgentCollRepo(req, res, next) {
    try {
      const db = await DashBoardServices.AreaWiseAgentCollection(
        req,
        res,
        next
      );
      next();
      return db;
    } catch {
      return res.status(400).json({ msg: "error" });
    }
  }

  async dueleads(req, res, next) {
    try {
      const getUserResponse = await DashBoardServices.LeadToBeFollow(
        req,
        res,
        next
      );
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async colectionstatus(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await CollectionSubmissonService.ColectionStatus(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async agentlotlist(req, res, next) {
    try {
      // 
      const CustomerCollectionResponse =
        await CollectionSubmissonService.AgentLotList(req, res, next);
      next();
      return CustomerCollectionResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
}
module.exports = new AgentController();

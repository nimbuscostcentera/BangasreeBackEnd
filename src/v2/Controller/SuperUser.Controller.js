const {
  SuperUserServices,
  UserShowService,
  UserPermissonService,
  UserPermissonAddService,
  SchemeAddService,
  SchemeViewService,
  SchemeEditService,
  PageShowService,
  SchemeSearchService,
  SchemeApproveService,
  MaturityStatusService,
  BonusStatusService,
  DropDownBranchService,
  CreateBranchService,
  CreateAreaService,
  ApproveBranchService,
  ApproveAreaService,
  EditBranchService,
  EditAreaService,
  ApproveSuperUserService,
  CreatePassbookService,
  PassBookAssignService,
  PassBookShowService,
  SuperuserEditService,
  DesignationShowService,
  DesignationCreateService,
  agentcommisonService,
  excellimportService,
  DashBoardServices,
  CustomerCollectionService,
} = require("../Services/index");
const { sq } = require("../../DataBase/ormdb");
const { UserPermissions } = require("../Model/UserPermission.Model");
class SuperUserController {
  ListofSuperUser = async (req, res, next) => {
    try {
      const SUCreponse = await SuperUserServices.getAllSuperUser(
        req,
        res,
        next
      );
      next();
      return SUCreponse;
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  };

  async showuser(req, res, next) {
    try {
      const getUserResponse = await UserShowService.UserShow(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async showpage(req, res, next) {
    try {
      const getUserResponse = await PageShowService.PageShow(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async permissonuser(req, res, next) {
    try {
      const getUserResponse = await UserPermissonService.UserPermisson(
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

  async permissonadduser(req, res, next) {
    try {
      const getUserResponse = await UserPermissonAddService.UserPermissonAdd(
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

  async schemeadd(req, res, next) {
    var UUid = req.body.UUid;
    var url = req.url;
    console.log(url);
    try {
      const getUserResponse = await SchemeAddService.SchemeAdd(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async schemeview(req, res, next) {
    try {
      const getUserResponse = await SchemeViewService.SchemeView(
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

  async schemeedit(req, res, next) {
    try {
      const getUserResponse = await SchemeEditService.SchemeEdit(
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
  async schemesearch(req, res, next) {
    try {
      const getUserResponse = await SchemeSearchService.SchemeSearch(
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

  async schemeapprove(req, res, next) {
    try {
      const getUserResponse = await SchemeApproveService.SchemeApprove(
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
  async maturitystatus(req, res, next) {
    try {
      const getUserResponse = await MaturityStatusService.MaturityStatus(
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
  async bonusstatus(req, res, next) {
    try {
      const getUserResponse = await BonusStatusService.BonusStatus(
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

  async dropdownbranch(req, res, next) {
    try {
      const getUserResponse = await DropDownBranchService.DropDownBranch(
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

  async dropdownbranch(req, res, next) {
    try {
      const getUserResponse = await DropDownBranchService.DropDownBranch(
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

  async createbranch(req, res, next) {
    try {
      const getUserResponse = await CreateBranchService.CreateBranch(
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

  async editbranch(req, res, next) {
    try {
      const getUserResponse = await EditBranchService.EditBranch(
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
  async createarea(req, res, next) {
    try {
      const getUserResponse = await CreateAreaService.CreateArea(
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

  async editarea(req, res, next) {
    try {
      const getUserResponse = await EditAreaService.EditArea(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async approvebranch(req, res, next) {
    try {
      const getUserResponse = await ApproveBranchService.ApproveBranch(
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

  async approvearea(req, res, next) {
    try {
      const getUserResponse = await ApproveAreaService.ApproveArea(
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

  async approvesuperuser(req, res, next) {
    try {
      const getUserResponse = await ApproveSuperUserService.ApproveSuperuser(
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

  async createpassbook(req, res, next) {
    try {
      const getUserResponse = await CreatePassbookService.CreatePassbook(
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

  async transferpassbook(req, res, next) {
    try {
      const getUserResponse = await CreatePassbookService.TransferPassbook(
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
  async passbookassign(req, res, next) {
    try {
      const getUserResponse = await PassBookAssignService.AssignPassBookToAgent(
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
  async passbookreturn(req, res, next) {
    try {
      const getUserResponse = await PassBookAssignService.ReturnPassBookToAgent(
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
  async passbookreturncust(req, res, next) {
    try {
      const getUserResponse =
        await PassBookAssignService.ReturnPassBookToCustomer(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async passbookassigncust(req, res, next) {
    try {
      const getUserResponse =
        await PassBookAssignService.AssignPassBookToCustomer(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async passbookdropdown(req, res, next) {
    try {
      const getUserResponse = await PassBookShowService.DropDownPassbook(
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

  async passbookstock(req, res, next) {
    try {
      const getUserResponse = await PassBookShowService.PassbookStock(
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

  async passbookshow(req, res, next) {
    try {
      const getUserResponse = await PassBookShowService.ShowPassbook(
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

  async superuseredit(req, res, next) {
    try {
      const getUserResponse = await SuperuserEditService.EditSuperUser(
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

  async userlist(req, res, next) {
    try {
      const getUserResponse = await SuperUserServices.ListUser(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async superuserdelete(req, res, next) {
    try {
      const getUserResponse = await SuperuserEditService.DeleteSuperUser(
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

  async agentdelete(req, res, next) {
    try {
      const getUserResponse = await SuperuserEditService.DeleteAgent(
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

  async customerdelete(req, res, next) {
    try {
      const getUserResponse = await SuperuserEditService.DeleteCustomer(
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

  async deletebranch(req, res, next) {
    try {
      const getUserResponse = await EditBranchService.DeleteBranch(
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

  async deletearea(req, res, next) {
    try {
      const getUserResponse = await EditAreaService.DeleteArea(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async deletescheme(req, res, next) {
    try {
      const getUserResponse = await SchemeEditService.DeleteScheme(
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
  async passbooknotassign(req, res, next) {
    console.log(req.body);
    try {
      const getUserResponse = await PassBookShowService.UnAssignedPBList(
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
  async designationdropdown(req, res, next) {
    try {
      const getUserResponse = await DesignationShowService.DropDownDesignation(
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

  async designationcreate(req, res, next) {
    try {
      const getUserResponse = await DesignationCreateService.CreateDesignation(
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

  async agentcommison(req, res, next) {
    try {
      const getUserResponse = await agentcommisonService.CalculateCommison(
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

  async agentcommisonshow(req, res, next) {
    try {
      const getUserResponse = await agentcommisonService.ShowCommison(
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
  async agentcommisonpaid(req, res, next) {
    try {
      const getUserResponse = await agentcommisonService.PayCommison(
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
  async maturitycertificate(req, res, next) {
    try {
      const getUserResponse = await MaturityStatusService.MaturityCertificate(
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

  async maturitycertificateshow(req, res, next) {
    try {
      const getUserResponse =
        await MaturityStatusService.MaturityCertificateShow(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async yearlyreport(req, res, next) {
    try {
      const getUserResponse = await DashBoardServices.YearlyReport(
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

  async card(req, res, next) {
    try {
      const getUserResponse = await DashBoardServices.Card(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async topAgentCollection(req, res, next) {
    try {
      const getUserResponse = await DashBoardServices.topAgent(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }
  async maturityreport(req, res, next) {
    try {
      const getUserResponse = await DashBoardServices.MaturityReport(
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

  async yearlist(req, res, next) {
    try {
      const getUserResponse = await DashBoardServices.SessionList(
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

  async deletecollection(req, res, next) {
    try {
      const getUserResponse = await CustomerCollectionService.Deletecollection(
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
  async schemehistory(req, res, next) {
    try {
      const getUserResponse = await SchemeViewService.Schemehistory(
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
  async addpurity(req, res, next) {
    try {
      const getUserResponse = await SuperUserServices.AddPurity(req, res, next);
      next();
      return getUserResponse;
    } catch (err) {
      console.log(err);
      return res.status(400).json("error");
    }
  }

  async listpurity(req, res, next) {
    try {
      const getUserResponse = await SuperUserServices.ListPurity(
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

  async addgoldrate(req, res, next) {
    try {
      const getUserResponse = await SuperUserServices.AddGoldrate(
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

  async showgoldrate(req, res, next) {
    try {
      const getUserResponse = await SuperUserServices.ShowGoldrate(
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
  async ViewLogs(req, res, next){
    try{
        const getlogs=await SuperUserServices.GetAllLogs(req,res,next);
        next(); 
        return getlogs
      }
      catch(err){
        return res.status(500).json("error");
      }
  }
}

module.exports = new SuperUserController();

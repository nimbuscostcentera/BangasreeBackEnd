const { sq } = require("../../config/ormdb");
const getAllSuperUser = () => {
  const Email = req.body.email;
  const Pass = req.body.password;

  sq.sync().then(() => {
    SuperUserMasters.findAll()
      .then((res) => {
        return result.json(res);
      })
      .catch((err) => {
        return err;
      });
  });
};
module.exports = {
  getAllSuperUser,
};

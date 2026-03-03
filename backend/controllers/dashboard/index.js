const companyController = require("./companyController");
const officerController = require("./officerController");
const filingController = require("./filingController");
const auditLogController = require("./auditLogController");

module.exports = {
  ...companyController,
  ...officerController,
  ...filingController,
  ...auditLogController,
};

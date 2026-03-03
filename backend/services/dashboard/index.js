const companyService = require("./companyService");
const officerService = require("./officerService");
const filingService = require("./filingService");
const auditLogService = require("./auditLogService");

module.exports = {
  ...companyService,
  ...officerService,
  ...filingService,
  ...auditLogService,
};

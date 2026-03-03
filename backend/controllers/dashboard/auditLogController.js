const dashboardService = require("../../services/dashboard");
const { createHandler } = require("./handler");

const getAuditLogs = createHandler({
  defaultMessage: "Failed to load audit logs",
  handler: async () => dashboardService.getAuditLogs(),
});

module.exports = {
  getAuditLogs,
};

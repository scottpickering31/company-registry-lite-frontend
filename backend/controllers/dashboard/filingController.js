const dashboardService = require("../../services/dashboard");
const { createHandler } = require("./handler");

const getFilings = createHandler({
  defaultMessage: "Failed to load filings",
  handler: async () => dashboardService.getFilings(),
});

const createFiling = createHandler({
  defaultMessage: "Failed to create filing",
  successStatus: 201,
  handler: async (req) => {
    const { companyId, type, description, officerId } = req.body || {};
    const uploadedFile = req.file;

    return dashboardService.createFiling({
      companyId,
      type,
      description,
      officerId,
      uploadedFile,
    });
  },
});

module.exports = {
  getFilings,
  createFiling,
};

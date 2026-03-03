const dashboardService = require("../../services/dashboard");
const { createHandler } = require("./handler");

const getOfficerTable = createHandler({
  defaultMessage: "Failed to load officers",
  handler: async () => dashboardService.getOfficerTable(),
});

const getOfficerDetails = createHandler({
  defaultMessage: "Failed to load officer details",
  handler: async (req) => {
    const { id } = req.params;
    return dashboardService.getOfficerDetailsById(id);
  },
});

const createOfficer = createHandler({
  defaultMessage: "Failed to create officer",
  successStatus: 201,
  handler: async (req) => {
    const { name, companyId, role, appointed, resigned } = req.body || {};
    return dashboardService.createOfficer({
      name,
      companyId,
      role,
      appointed,
      resigned,
    });
  },
});

const deleteOfficer = createHandler({
  defaultMessage: "Failed to delete officer",
  handler: async (req) => {
    const { id } = req.params;
    const deletedOfficer = await dashboardService.deleteOfficerById(id);

    return {
      message: `Officer "${deletedOfficer.name}" deleted successfully`,
      deletedOfficer,
    };
  },
});

module.exports = {
  getOfficerTable,
  getOfficerDetails,
  createOfficer,
  deleteOfficer,
};

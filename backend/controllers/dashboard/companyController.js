const dashboardService = require("../../services/dashboard");
const { createHandler } = require("./handler");

const mapCompanyNumberDuplicate = (error) => {
  if (error?.code === "23505") {
    return {
      statusCode: 409,
      message: "Company number already exists",
    };
  }

  return null;
};

const getCompanyTable = createHandler({
  defaultMessage: "Failed to load companies",
  handler: async (req) => {
    const { status, q, sortBy, page, pageSize } = req.query;
    return dashboardService.getCompanyTable({
      status,
      q,
      sortBy,
      page,
      pageSize,
    });
  },
});

const getCompanyDetails = createHandler({
  defaultMessage: "Failed to load company details",
  handler: async (req) => {
    const { id } = req.params;
    return dashboardService.getCompanyDetailsById(id);
  },
});

const createCompany = createHandler({
  defaultMessage: "Failed to create company",
  successStatus: 201,
  mapError: mapCompanyNumberDuplicate,
  handler: async (req) => {
    const { name, companyNumber, status } = req.body || {};
    return dashboardService.createCompany({
      name,
      companyNumber,
      status,
    });
  },
});

const updateCompany = createHandler({
  defaultMessage: "Failed to update company",
  mapError: mapCompanyNumberDuplicate,
  handler: async (req) => {
    const { id } = req.params;
    const { name, companyNumber, status } = req.body || {};

    return dashboardService.updateCompanyById(id, {
      name,
      companyNumber,
      status,
    });
  },
});

const deleteCompany = createHandler({
  defaultMessage: "Failed to delete company",
  handler: async (req) => {
    const { id } = req.params;
    const deletedCompany = await dashboardService.deleteCompanyById(id);

    return {
      message: `Company "${deletedCompany.name}" deleted successfully`,
      deletedCompany,
    };
  },
});

module.exports = {
  getCompanyTable,
  getCompanyDetails,
  createCompany,
  updateCompany,
  deleteCompany,
};

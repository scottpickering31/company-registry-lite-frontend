const dashboardService = require("../services/dashboardService");

const getCompanyTable = async (req, res) => {
  const { status, q, sortBy, page, pageSize } = req.query;
  try {
    const payload = await dashboardService.getCompanyTable({
      status,
      q,
      sortBy,
      page,
      pageSize,
    });
    res.json(payload);
  } catch (error) {
    console.error("Failed to fetch companies from database", error);
    res.status(500).json({ message: "Failed to load companies" });
  }
};

const getCompanyDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const payload = await dashboardService.getCompanyDetailsById(id);
    res.json(payload);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to fetch company details from database", error);
    res.status(500).json({ message: "Failed to load company details" });
  }
};

const getOfficerTable = async (_req, res) => {
  try {
    const payload = await dashboardService.getOfficerTable();
    res.json(payload);
  } catch (error) {
    console.error("Failed to fetch officers from database", error);
    res.status(500).json({ message: "Failed to load officers" });
  }
};

const getOfficerDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const payload = await dashboardService.getOfficerDetailsById(id);
    res.json(payload);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to fetch officer details from database", error);
    res.status(500).json({ message: "Failed to load officer details" });
  }
};

const getAuditLogs = async (_req, res) => {
  try {
    const payload = await dashboardService.getAuditLogs();
    res.json(payload);
  } catch (error) {
    console.error("Failed to fetch audit logs from database", error);
    res.status(500).json({ message: "Failed to load audit logs" });
  }
};

const getFilings = async (_req, res) => {
  try {
    const payload = await dashboardService.getFilings();
    res.json(payload);
  } catch (error) {
    console.error("Failed to fetch filings from database", error);
    res.status(500).json({ message: "Failed to load filings" });
  }
};

const createCompany = async (req, res) => {
  const { name, companyNumber, status } = req.body || {};

  try {
    const createdCompany = await dashboardService.createCompany({
      name,
      companyNumber,
      status,
    });

    res.status(201).json(createdCompany);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    if (error?.code === "23505") {
      res.status(409).json({ message: "Company number already exists" });
      return;
    }

    console.error("Failed to create company", error);
    res.status(500).json({ message: "Failed to create company" });
  }
};

const createOfficer = async (req, res) => {
  const { name, companyId, role, appointed, resigned } = req.body || {};

  try {
    const createdOfficer = await dashboardService.createOfficer({
      name,
      companyId,
      role,
      appointed,
      resigned,
    });

    res.status(201).json(createdOfficer);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to create officer", error);
    res.status(500).json({ message: "Failed to create officer" });
  }
};

const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, companyNumber, status } = req.body || {};

  try {
    const updatedCompany = await dashboardService.updateCompanyById(id, {
      name,
      companyNumber,
      status,
    });

    res.status(200).json(updatedCompany);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    if (error?.code === "23505") {
      res.status(409).json({ message: "Company number already exists" });
      return;
    }

    console.error("Failed to update company", error);
    res.status(500).json({ message: "Failed to update company" });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCompany = await dashboardService.deleteCompanyById(id);
    res.status(200).json({
      message: `Company "${deletedCompany.name}" deleted successfully`,
      deletedCompany,
    });
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to delete company", error);
    res.status(500).json({ message: "Failed to delete company" });
  }
};

const deleteOfficer = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOfficer = await dashboardService.deleteOfficerById(id);
    res.status(200).json({
      message: `Officer "${deletedOfficer.name}" deleted successfully`,
      deletedOfficer,
    });
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to delete officer", error);
    res.status(500).json({ message: "Failed to delete officer" });
  }
};

const createFiling = async (req, res) => {
  const { companyId, type, description, officerId } = req.body || {};
  const uploadedFile = req.file;

  try {
    const createdFiling = await dashboardService.createFiling({
      companyId,
      type,
      description,
      officerId,
      uploadedFile,
    });

    res.status(201).json(createdFiling);
  } catch (error) {
    if (error?.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Failed to create filing", error);
    res.status(500).json({ message: "Failed to create filing" });
  }
};

module.exports = {
  getCompanyTable,
  getCompanyDetails,
  getOfficerTable,
  getOfficerDetails,
  getAuditLogs,
  getFilings,
  createCompany,
  updateCompany,
  deleteCompany,
  deleteOfficer,
  createOfficer,
  createFiling,
};

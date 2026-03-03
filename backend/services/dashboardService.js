const fs = require("fs/promises");
const path = require("path");
const pool = require("../db");

const companyColumns = [
  { key: "name", header: "Company Name", type: "bold" },
  { key: "companyNumber", header: "Company Number", type: "text" },
  { key: "status", header: "Status", type: "status" },
  { key: "actions", header: "Actions", type: "actions" },
];

const normalizeStatusForDb = (status) => {
  if (!status) return null;
  const normalized = String(status).trim().toLowerCase();
  if (normalized === "active") return "active";
  if (normalized === "dormant") return "dormant";
  return null;
};

const parseCompanyId = (companyId) => {
  const safeCompanyId = Number(companyId);
  if (!Number.isInteger(safeCompanyId) || safeCompanyId <= 0) {
    throw { statusCode: 400, message: "A valid company id is required" };
  }
  return safeCompanyId;
};

const parseOfficerId = (officerId) => {
  const safeOfficerId = Number(officerId);
  if (!Number.isInteger(safeOfficerId) || safeOfficerId <= 0) {
    throw { statusCode: 400, message: "A valid officer id is required" };
  }
  return safeOfficerId;
};

const validateCompanyPayload = ({ name, companyNumber, status }) => {
  const safeName = String(name || "").trim();
  const safeCompanyNumber = String(companyNumber || "").trim();
  const safeStatus = normalizeStatusForDb(status);

  if (!safeName) {
    throw { statusCode: 400, message: "Company name is required" };
  }

  if (!safeCompanyNumber) {
    throw { statusCode: 400, message: "Company number is required" };
  }

  if (!/^\d+$/.test(safeCompanyNumber)) {
    throw { statusCode: 400, message: "Company number must contain digits only" };
  }

  if (!safeStatus) {
    throw {
      statusCode: 400,
      message: "Status must be either Active or Dormant",
    };
  }

  return {
    safeName,
    safeCompanyNumber,
    safeStatus,
  };
};

const toDisplayStatus = (status) => {
  const normalized = normalizeStatusForDb(status);
  if (normalized === "active") return "Active";
  if (normalized === "dormant") return "Dormant";
  return null;
};

const normalizeSort = (sortBy) => {
  if (!sortBy) return null;
  const normalized = String(sortBy).trim().toLowerCase();
  if (normalized === "name") return "name";
  if (normalized === "company number") return "companyNumber";
  if (normalized === "number") return "companyNumber";
  if (normalized === "date created") return "dateCreated";
  if (normalized === "created_at") return "dateCreated";
  return null;
};

const getCompanyTable = async ({ status, q, sortBy, page, pageSize }) => {
  const safePageSize =
    Number.isFinite(Number(pageSize)) && Number(pageSize) > 0
      ? Number(pageSize)
      : 10;
  const safePage =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const offset = (safePage - 1) * safePageSize;

  const whereClauses = [];
  const values = [];

  const normalizedStatus = normalizeStatusForDb(status);
  if (normalizedStatus) {
    values.push(normalizedStatus);
    whereClauses.push(`status::text = $${values.length}`);
  }

  if (q) {
    const needle = String(q).trim().toLowerCase();
    if (needle) {
      values.push(`%${needle}%`);
      whereClauses.push(
        `(LOWER(name) LIKE $${values.length} OR LOWER(company_number::text) LIKE $${values.length})`,
      );
    }
  }

  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const normalizedSort = normalizeSort(sortBy);
  let orderBy = "name ASC";
  if (normalizedSort === "name") {
    orderBy = "name ASC";
  } else if (normalizedSort === "companyNumber") {
    orderBy = "company_number ASC";
  } else if (normalizedSort === "dateCreated") {
    orderBy = "created_at DESC";
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM companies ${whereSql}`,
    values,
  );

  const dataValues = [...values, safePageSize, offset];
  const rowsResult = await pool.query(
    `
      SELECT
        id,
        name,
        status,
        company_number AS "companyNumber"
      FROM companies
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT $${dataValues.length - 1}
      OFFSET $${dataValues.length}
    `,
    dataValues,
  );

  return {
    columns: companyColumns,
    page: safePage,
    pageSize: safePageSize,
    total: countResult.rows[0]?.total ?? 0,
    rows: rowsResult.rows.map((row) => ({
      ...row,
      status: toDisplayStatus(row.status) ?? row.status,
    })),
  };
};

const getCompanyDetailsById = async (companyId) => {
  const safeCompanyId = parseCompanyId(companyId);

  const companyResult = await pool.query(
    `
      SELECT
        id,
        name,
        status,
        company_number AS "companyNumber",
        created_at
      FROM companies
      WHERE id = $1
      LIMIT 1
    `,
    [safeCompanyId],
  );

  const companyRow = companyResult.rows[0];
  if (!companyRow) {
    throw { statusCode: 404, message: "Company not found" };
  }

  const officersResult = await pool.query(
    `
      SELECT
        o.id,
        o.name,
        o.role,
        o.appointed_on AS appointed,
        o.resigned_on AS resigned
      FROM officers o
      WHERE o.company_id = $1
      ORDER BY o.id DESC
    `,
    [safeCompanyId],
  );

  const filingsResult = await pool.query(
    `
      SELECT
        f.id,
        f.id AS filing_id,
        f.type,
        f.submitted_at,
        f.file_name,
        f.storage_key,
        COALESCE(o.name, 'System') AS submitted_by
      FROM filings f
      LEFT JOIN officers o ON o.id = f.submitted_by_officer_id
      WHERE f.company_id = $1
      ORDER BY f.submitted_at DESC, f.id DESC
      LIMIT 10
    `,
    [safeCompanyId],
  );

  const auditLogsResult = await pool.query(
    `
      SELECT
        al.id,
        al.occurred_at,
        al.event,
        COALESCE(o.name, 'System') AS officer_name
      FROM audit_logs al
      LEFT JOIN officers o ON o.id = al.officer_id
      WHERE al.company_id = $1
      ORDER BY al.occurred_at DESC, al.id DESC
      LIMIT 10
    `,
    [safeCompanyId],
  );

  return {
    company: {
      id: companyRow.id,
      name: companyRow.name,
      status: toDisplayStatus(companyRow.status) ?? companyRow.status,
      companyNumber: companyRow.companyNumber,
      createdAt: formatDateUk(companyRow.created_at),
    },
    officers: officersResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      appointed: formatDateUk(row.appointed),
      resigned: row.resigned ? formatDateUk(row.resigned) : "",
    })),
    filings: filingsResult.rows.map((row) => ({
      id: row.id,
      filingId: row.filing_id,
      type: row.type,
      dateSubmitted: formatDateUk(row.submitted_at),
      submittedBy: row.submitted_by,
      documentName: row.file_name,
      documentPath: row.storage_key,
    })),
    auditLogs: auditLogsResult.rows.map((row) => ({
      id: row.id,
      occurredAt: formatDateUk(row.occurred_at),
      event: row.event,
      officerName: row.officer_name,
    })),
  };
};

const getOfficerTable = async () => {
  const result = await pool.query(`
    SELECT
      o.id,
      o.name,
      c.name AS company,
      o.role,
      o.appointed_on AS appointed,
      o.resigned_on AS resigned
    FROM officers o
    JOIN companies c ON c.id = o.company_id
    ORDER BY o.id DESC
  `);

  return result.rows.map((row) => ({
    ...row,
    resigned: row.resigned ?? "",
  }));
};

const getOfficerDetailsById = async (officerId) => {
  const safeOfficerId = parseOfficerId(officerId);

  const officerResult = await pool.query(
    `
      SELECT
        o.id,
        o.name,
        o.role,
        o.appointed_on AS appointed,
        o.resigned_on AS resigned,
        c.id AS company_id,
        c.name AS company_name,
        c.company_number AS company_number,
        c.status AS company_status
      FROM officers o
      JOIN companies c ON c.id = o.company_id
      WHERE o.id = $1
      LIMIT 1
    `,
    [safeOfficerId],
  );

  const officerRow = officerResult.rows[0];
  if (!officerRow) {
    throw { statusCode: 404, message: "Officer not found" };
  }

  const filingsResult = await pool.query(
    `
      SELECT
        f.id,
        f.type,
        f.description,
        f.submitted_at,
        f.file_name,
        f.storage_key,
        c.id AS company_id,
        c.name AS company_name
      FROM filings f
      JOIN companies c ON c.id = f.company_id
      WHERE f.submitted_by_officer_id = $1
      ORDER BY f.submitted_at DESC, f.id DESC
      LIMIT 10
    `,
    [safeOfficerId],
  );

  const auditLogsResult = await pool.query(
    `
      SELECT
        al.id,
        al.occurred_at,
        al.event,
        c.id AS company_id,
        c.name AS company_name
      FROM audit_logs al
      JOIN companies c ON c.id = al.company_id
      WHERE al.officer_id = $1
      ORDER BY al.occurred_at DESC, al.id DESC
      LIMIT 10
    `,
    [safeOfficerId],
  );

  return {
    officer: {
      id: officerRow.id,
      name: officerRow.name,
      role: officerRow.role,
      appointed: formatDateUk(officerRow.appointed),
      resigned: officerRow.resigned ? formatDateUk(officerRow.resigned) : "",
    },
    company: {
      id: officerRow.company_id,
      name: officerRow.company_name,
      companyNumber: String(officerRow.company_number ?? ""),
      status: toDisplayStatus(officerRow.company_status) ?? officerRow.company_status,
    },
    recentFilings: filingsResult.rows.map((row) => ({
      id: row.id,
      type: row.type,
      description: row.description ?? "",
      submittedAt: formatDateUk(row.submitted_at),
      documentName: row.file_name,
      documentPath: row.storage_key,
      companyId: row.company_id,
      companyName: row.company_name,
    })),
    recentAuditLogs: auditLogsResult.rows.map((row) => ({
      id: row.id,
      occurredAt: formatDateUk(row.occurred_at),
      event: row.event,
      companyId: row.company_id,
      companyName: row.company_name,
    })),
  };
};

const formatDateUk = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-GB").format(date);
};

const getAuditLogs = async () => {
  const result = await pool.query(`
    SELECT
      al.id,
      al.occurred_at,
      al.event,
      c.name AS company_name,
      o.name AS officer_name
    FROM audit_logs al
    JOIN companies c ON c.id = al.company_id
    LEFT JOIN officers o ON o.id = al.officer_id
    ORDER BY al.occurred_at DESC, al.id DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    occurredAt: formatDateUk(row.occurred_at),
    event: row.event,
    companyName: row.company_name,
    officerName: row.officer_name ?? "",
    name: row.company_name,
  }));
};

const getFilings = async () => {
  const result = await pool.query(`
    SELECT
      f.id,
      f.id AS filing_id,
      c.name AS company_name,
      f.type,
      f.submitted_at,
      COALESCE(o.name, 'System') AS submitted_by,
      f.file_name,
      f.storage_key
    FROM filings f
    JOIN companies c ON c.id = f.company_id
    LEFT JOIN officers o ON o.id = f.submitted_by_officer_id
    ORDER BY f.submitted_at DESC, f.id DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    filingId: row.filing_id,
    name: row.company_name,
    type: row.type,
    dateSubmitted: formatDateUk(row.submitted_at),
    submittedBy: row.submitted_by,
    documentName: row.file_name,
    documentPath: row.storage_key,
  }));
};

const createFiling = async ({
  companyId,
  type,
  description,
  officerId,
  uploadedFile,
}) => {
  const safeCompanyId = Number(companyId);
  const safeType = String(type || "").trim();
  const safeDescription = String(description || "").trim();
  const safeOfficerId =
    officerId === undefined || officerId === null || officerId === ""
      ? null
      : Number(officerId);

  if (!Number.isInteger(safeCompanyId) || safeCompanyId <= 0) {
    throw { statusCode: 400, message: "A valid company is required" };
  }

  if (!safeType) {
    throw { statusCode: 400, message: "Filing type is required" };
  }

  if (!uploadedFile) {
    throw { statusCode: 400, message: "A valid PDF file is required" };
  }

  const isPdfMime = uploadedFile.mimetype === "application/pdf";
  const isPdfName = String(uploadedFile.originalname || "")
    .toLowerCase()
    .endsWith(".pdf");
  if (!isPdfMime && !isPdfName) {
    throw { statusCode: 400, message: "File must be a PDF" };
  }

  const companyExists = await pool.query(
    "SELECT id FROM companies WHERE id = $1",
    [safeCompanyId],
  );

  if (!companyExists.rows[0]) {
    throw { statusCode: 400, message: "Selected company does not exist" };
  }

  if (safeOfficerId !== null) {
    if (!Number.isInteger(safeOfficerId) || safeOfficerId <= 0) {
      throw { statusCode: 400, message: "Officer must be valid when provided" };
    }

    const officerExists = await pool.query(
      "SELECT id FROM officers WHERE id = $1 AND company_id = $2",
      [safeOfficerId, safeCompanyId],
    );

    if (!officerExists.rows[0]) {
      throw {
        statusCode: 400,
        message: "Selected officer does not belong to this company",
      };
    }
  }

  const absoluteFilePath = uploadedFile.path;
  const publicFilePath = `/uploads/filings/${uploadedFile.filename}`;
  const safeOriginalName = String(uploadedFile.originalname || "").trim();
  const safeFileSizeBytes = Number(uploadedFile.size);

  if (!Number.isFinite(safeFileSizeBytes) || safeFileSizeBytes <= 0) {
    await fs.unlink(absoluteFilePath).catch(() => {});
    throw { statusCode: 400, message: "Uploaded PDF is empty" };
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO filings (
          company_id,
          submitted_by_officer_id,
          type,
          description,
          file_name,
          storage_key,
          file_mime,
          file_size_bytes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, submitted_at
      `,
      [
        safeCompanyId,
        safeOfficerId,
        safeType,
        safeDescription || null,
        safeOriginalName,
        publicFilePath,
        uploadedFile.mimetype || "application/pdf",
        safeFileSizeBytes,
      ],
    );

    return {
      id: result.rows[0].id,
      dateSubmitted: formatDateUk(result.rows[0].submitted_at),
      documentPath: publicFilePath,
    };
  } catch (error) {
    await fs.unlink(absoluteFilePath).catch(() => {});
    throw error;
  }
};

const createCompany = async ({ name, companyNumber, status }) => {
  const { safeName, safeCompanyNumber, safeStatus } = validateCompanyPayload({
    name,
    companyNumber,
    status,
  });

  const result = await pool.query(
    `
      INSERT INTO companies (name, company_number, status)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        company_number AS "companyNumber",
        status
    `,
    [safeName, safeCompanyNumber, safeStatus],
  );

  const insertedCompany = result.rows[0];

  return {
    ...insertedCompany,
    status: toDisplayStatus(insertedCompany.status) ?? insertedCompany.status,
  };
};

const updateCompanyById = async (companyId, { name, companyNumber, status }) => {
  const safeCompanyId = parseCompanyId(companyId);
  const { safeName, safeCompanyNumber, safeStatus } = validateCompanyPayload({
    name,
    companyNumber,
    status,
  });

  const result = await pool.query(
    `
      UPDATE companies
      SET
        name = $2,
        company_number = $3,
        status = $4
      WHERE id = $1
      RETURNING
        id,
        name,
        company_number AS "companyNumber",
        status
    `,
    [safeCompanyId, safeName, safeCompanyNumber, safeStatus],
  );

  const updatedCompany = result.rows[0];
  if (!updatedCompany) {
    throw { statusCode: 404, message: "Company not found" };
  }

  return {
    ...updatedCompany,
    status: toDisplayStatus(updatedCompany.status) ?? updatedCompany.status,
  };
};

const deleteCompanyById = async (companyId) => {
  const safeCompanyId = parseCompanyId(companyId);

  const fileRows = await pool.query(
    `
      SELECT storage_key
      FROM filings
      WHERE company_id = $1
    `,
    [safeCompanyId],
  );

  const result = await pool.query(
    `
      DELETE FROM companies
      WHERE id = $1
      RETURNING id, name
    `,
    [safeCompanyId],
  );

  const deletedCompany = result.rows[0];
  if (!deletedCompany) {
    throw { statusCode: 404, message: "Company not found" };
  }

  const unlinkTasks = fileRows.rows
    .map((row) => String(row.storage_key || "").trim())
    .filter((storageKey) => storageKey.startsWith("/uploads/"))
    .map((storageKey) => {
      const relativePath = storageKey.replace(/^\/+/, "");
      const absolutePath = path.join(__dirname, "..", relativePath);
      return fs.unlink(absolutePath).catch(() => undefined);
    });

  await Promise.all(unlinkTasks);

  return deletedCompany;
};

const deleteOfficerById = async (officerId) => {
  const safeOfficerId = parseOfficerId(officerId);

  const result = await pool.query(
    `
      DELETE FROM officers
      WHERE id = $1
      RETURNING id, name
    `,
    [safeOfficerId],
  );

  const deletedOfficer = result.rows[0];
  if (!deletedOfficer) {
    throw { statusCode: 404, message: "Officer not found" };
  }

  return deletedOfficer;
};

const parseDateOnly = (value) => {
  if (!value) return null;
  const parsed = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed)) return null;
  return parsed;
};

const createOfficer = async ({
  name,
  companyId,
  role,
  appointed,
  resigned,
}) => {
  const safeName = String(name || "").trim();
  const safeRole = String(role || "").trim();
  const safeCompanyId = Number(companyId);
  const safeAppointed = parseDateOnly(appointed);
  const safeResigned = parseDateOnly(resigned);

  if (!safeName) {
    throw { statusCode: 400, message: "Officer name is required" };
  }

  if (!Number.isInteger(safeCompanyId) || safeCompanyId <= 0) {
    throw { statusCode: 400, message: "A valid company is required" };
  }

  if (!safeRole) {
    throw { statusCode: 400, message: "Officer role is required" };
  }

  if (!safeAppointed) {
    throw { statusCode: 400, message: "Appointed date is required" };
  }

  if (resigned && !safeResigned) {
    throw { statusCode: 400, message: "Resigned date must be YYYY-MM-DD" };
  }

  if (safeResigned && safeResigned < safeAppointed) {
    throw {
      statusCode: 400,
      message: "Resigned date cannot be before appointed date",
    };
  }

  const companyExists = await pool.query(
    "SELECT id FROM companies WHERE id = $1",
    [safeCompanyId],
  );

  if (!companyExists.rows[0]) {
    throw { statusCode: 400, message: "Selected company does not exist" };
  }

  const result = await pool.query(
    `
      INSERT INTO officers (name, company_id, role, appointed_on, resigned_on)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, role, appointed_on AS appointed, resigned_on AS resigned
    `,
    [safeName, safeCompanyId, safeRole, safeAppointed, safeResigned],
  );

  return result.rows[0];
};

module.exports = {
  getCompanyTable,
  getCompanyDetailsById,
  getOfficerTable,
  getOfficerDetailsById,
  getAuditLogs,
  getFilings,
  createCompany,
  updateCompanyById,
  deleteCompanyById,
  deleteOfficerById,
  createOfficer,
  createFiling,
};

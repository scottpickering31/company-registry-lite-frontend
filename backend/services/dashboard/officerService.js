const pool = require("../../db");
const {
  parseOfficerId,
  parseDateOnly,
  toDisplayStatus,
  formatDateUk,
} = require("./common");

const getOfficerTable = async () => {
  const result = await pool.query(`
    SELECT
      o.id,
      o.name,
      c.name AS company,
      o.role,
      o.appointed_on AS appointed,
      o.resigned_on AS resigned
    FROM public.officers o
    JOIN public.companies c ON c.id = o.company_id
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
      FROM public.officers o
      JOIN public.companies c ON c.id = o.company_id
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
      FROM public.filings f
      JOIN public.companies c ON c.id = f.company_id
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
      FROM public.audit_logs al
      JOIN public.companies c ON c.id = al.company_id
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

const deleteOfficerById = async (officerId) => {
  const safeOfficerId = parseOfficerId(officerId);

  const result = await pool.query(
    `
      DELETE FROM public.officers
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
    "SELECT id FROM public.companies WHERE id = $1",
    [safeCompanyId],
  );

  if (!companyExists.rows[0]) {
    throw { statusCode: 400, message: "Selected company does not exist" };
  }

  const result = await pool.query(
    `
      INSERT INTO public.officers (name, company_id, role, appointed_on, resigned_on)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, role, appointed_on AS appointed, resigned_on AS resigned
    `,
    [safeName, safeCompanyId, safeRole, safeAppointed, safeResigned],
  );

  return result.rows[0];
};

module.exports = {
  getOfficerTable,
  getOfficerDetailsById,
  deleteOfficerById,
  createOfficer,
};

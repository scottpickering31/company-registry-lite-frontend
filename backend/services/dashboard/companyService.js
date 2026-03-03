const pool = require("../../db");
const {
  normalizeStatusForDb,
  toDisplayStatus,
  parseCompanyId,
  validateCompanyPayload,
  formatDateUk,
  unlinkUploadedFiles,
} = require("./common");

const companyColumns = [
  { key: "name", header: "Company Name", type: "bold" },
  { key: "companyNumber", header: "Company Number", type: "text" },
  { key: "status", header: "Status", type: "status" },
  { key: "actions", header: "Actions", type: "actions" },
];

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
  if (normalizedSort === "companyNumber") {
    orderBy = "company_number ASC";
  } else if (normalizedSort === "dateCreated") {
    orderBy = "created_at DESC";
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM public.companies ${whereSql}`,
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
      FROM public.companies
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
      FROM public.companies
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
      FROM public.officers o
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
      FROM public.filings f
      LEFT JOIN public.officers o ON o.id = f.submitted_by_officer_id
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
      FROM public.audit_logs al
      LEFT JOIN public.officers o ON o.id = al.officer_id
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

const createCompany = async ({ name, companyNumber, status }) => {
  const { safeName, safeCompanyNumber, safeStatus } = validateCompanyPayload({
    name,
    companyNumber,
    status,
  });

  const result = await pool.query(
    `
      INSERT INTO public.companies (name, company_number, status)
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
      UPDATE public.companies
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
      FROM public.filings
      WHERE company_id = $1
    `,
    [safeCompanyId],
  );

  const result = await pool.query(
    `
      DELETE FROM public.companies
      WHERE id = $1
      RETURNING id, name
    `,
    [safeCompanyId],
  );

  const deletedCompany = result.rows[0];
  if (!deletedCompany) {
    throw { statusCode: 404, message: "Company not found" };
  }

  await unlinkUploadedFiles(fileRows.rows.map((row) => row.storage_key));

  return deletedCompany;
};

module.exports = {
  getCompanyTable,
  getCompanyDetailsById,
  createCompany,
  updateCompanyById,
  deleteCompanyById,
};

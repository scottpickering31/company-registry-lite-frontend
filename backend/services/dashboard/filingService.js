const fs = require("fs/promises");
const pool = require("../../db");
const { formatDateUk } = require("./common");

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

module.exports = {
  getFilings,
  createFiling,
};

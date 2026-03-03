const fs = require("fs/promises");
const path = require("path");

const normalizeStatusForDb = (status) => {
  if (!status) return null;
  const normalized = String(status).trim().toLowerCase();
  if (normalized === "active") return "active";
  if (normalized === "dormant") return "dormant";
  return null;
};

const toDisplayStatus = (status) => {
  const normalized = normalizeStatusForDb(status);
  if (normalized === "active") return "Active";
  if (normalized === "dormant") return "Dormant";
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

const parseDateOnly = (value) => {
  if (!value) return null;
  const parsed = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed)) return null;
  return parsed;
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

const formatDateUk = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-GB").format(date);
};

const unlinkUploadedFiles = async (storageKeys) => {
  const unlinkTasks = storageKeys
    .map((storageKey) => String(storageKey || "").trim())
    .filter((storageKey) => storageKey.startsWith("/uploads/"))
    .map((storageKey) => {
      const relativePath = storageKey.replace(/^\/+/, "");
      const absolutePath = path.join(__dirname, "..", "..", relativePath);
      return fs.unlink(absolutePath).catch(() => undefined);
    });

  await Promise.all(unlinkTasks);
};

module.exports = {
  normalizeStatusForDb,
  toDisplayStatus,
  parseCompanyId,
  parseOfficerId,
  parseDateOnly,
  validateCompanyPayload,
  formatDateUk,
  unlinkUploadedFiles,
};

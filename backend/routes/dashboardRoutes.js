const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "uploads", "filings");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const safeOriginalName = String(file.originalname || "document.pdf")
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const nextName = `${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}-${safeOriginalName}`;
    cb(null, nextName);
  },
});

const uploadFilingPdf = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfName = String(file.originalname || "")
      .toLowerCase()
      .endsWith(".pdf");

    if (isPdfMime || isPdfName) {
      cb(null, true);
      return;
    }

    cb(new Error("Only PDF files are allowed"));
  },
});

router.get("/companies", dashboardController.getCompanyTable);
router.get("/companies/:id", dashboardController.getCompanyDetails);
router.get("/officers", dashboardController.getOfficerTable);
router.get("/audit-logs", dashboardController.getAuditLogs);
router.get("/filings", dashboardController.getFilings);
router.post("/companies", requireAuth, dashboardController.createCompany);
router.post("/officers", requireAuth, dashboardController.createOfficer);
router.post(
  "/filings",
  requireAuth,
  uploadFilingPdf.single("document"),
  dashboardController.createFiling,
);

module.exports = router;

const pool = require("../../db");
const { formatDateUk } = require("./common");

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

module.exports = {
  getAuditLogs,
};

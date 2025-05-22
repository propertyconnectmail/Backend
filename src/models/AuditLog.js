const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  id : String,
  actionType: String,
  performedBy: String,
  description: String,
  date: String
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports.AuditLog = AuditLog;
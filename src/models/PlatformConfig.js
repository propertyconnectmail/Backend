const mongoose = require('mongoose');

const PlatformConfigSchema = new mongoose.Schema({
  id: String,
  totalProfessionals: String,
  totalClients: String,
  totalRevenue: String,
  totalAppointments: String,
  maintenanceMode: String
}, { timestamps: true });

const PlatformConfig = mongoose.model("PlatformConfig", PlatformConfigSchema);

module.exports.PlatformConfig = PlatformConfig;
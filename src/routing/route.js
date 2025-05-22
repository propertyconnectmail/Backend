const router = require('express').Router();

const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const professionalRoutes = require('./routes/professional.routes');
const clientRoutes = require('./routes/client.routes');
const officialRoutes = require('./routes/official.routes');
const registryLocationRoutes = require('./routes/registryLocation.routes');
const auditLogRoutes = require('./routes/auditLog.routes');
const PlatformConfigRoutes = require('./routes/platformConfig.routes');
const AppointmentRoutes = require('./routes/appointment.routes');
const downloadZipRoute = require('../utils/downloadCertifications');

// Use route files
router.use('/api/employee', employeeRoutes);
router.use('/api/professional', professionalRoutes);
router.use('/api/client', clientRoutes);
router.use('/api/official', officialRoutes);
router.use('/api/registry', registryLocationRoutes);
router.use('/api/audit', auditLogRoutes);
router.use('/api/platform', PlatformConfigRoutes);
router.use('/api/appointment', AppointmentRoutes);

router.use('/api/auth', authRoutes);
router.use('/api/upload', uploadRoutes);

const { downloadCertificationsAsZip } = require('../utils/downloadCertifications');
const { Appointment } = require('../models/Appointment');


router.get('/api/certifications/download-zip', async (req, res) => {
  const urls = req.query.urls; // array of URLs like ['https://s3...', 'https://s3...']

  try {
    await downloadCertificationsAsZip(urls, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Default route
router.get('/get', (req, res) => {
  res.send({ message: 'API is working.' });
});

module.exports = router;

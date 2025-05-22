const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userType: { type: String, enum: ['client', 'professional'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

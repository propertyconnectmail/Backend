const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true },
  appointmentStatus: String,
  professionalName: String,
  professionalUrl: String,
  clientEmail: String,
  clientName: String,
  clientUrl: String,
  professionalEmail: String,
  appointmentDate: String,
  appointmentTime: String,
  zoomJoinLink: String,
  zoomStartLink: String,

  chatInitiated: { type: Boolean, default: false },
  clientDocumentsUploaded: { type: Boolean, default: false },
  professionalDocumentsUploaded: { type: Boolean, default: false },
  zoomMeetingCompletedClient: { type: Boolean, default: false },
  zoomMeetingCompletedProfessional: { type: Boolean, default: false },
  appointmentCompleted: { type: Boolean, default: false },

  clientDocuments: { type: [String], default: [] },
  professionalDocuments: { type: [String], default: [] },

  professionalPaymentStatus: String,
  totalPaymentAmount: String,
  professionalPaymentAmount: String,
  commission: String,
  transactionFee: String,

  chatId: String,

  // ============ FEEDBACK/COMPLAINT SYSTEM ============
  clientFeedback: {
    satisfied: { type: Boolean, default: null },
    complaintType: { type: String, default: '' },
    complaintMessage: { type: String, default: '' },
    submittedAt: { type: Date, default: null }
  },
  professionalFeedback: {
    satisfied: { type: Boolean, default: null },
    complaintType: { type: String, default: '' },
    complaintMessage: { type: String, default: '' },
    submittedAt: { type: Date, default: null }
  },
  hasComplaint: { type: Boolean, default: false },
  complaintStatus: { type: String, default: '' }, // 'pending', 'reviewing', 'resolved'
  
  // ============ NEW: Completion tracking for both parties ============
  appointmentCompletedByClient: { type: Boolean, default: false },
  appointmentCompletedByProfessional: { type: Boolean, default: false },
  // Add to your Appointment.js model schema
  complaintResolvedAt: { type: Date, default: null }
  // ============ END ============
}, {
  timestamps: true
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports.Appointment = Appointment;
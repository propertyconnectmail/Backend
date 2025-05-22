const mongoose = require('mongoose');

const ProfessionalSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    nic: String,
    password: String,
    googleId: String,
    phone: String,
    type: String,
    address: String,
    dob : String,
    url: String,
    status: String,
    consultationFee: String,
    totalRating: String,
    totalCount: String,
    averageRating: String,
    about: String,
    consults: String,
    experience: String,
    bankAccountDetails: {
        accountHolderName: { type: String },
        accountNumber: { type: String },
        bankName: { type: String },
        branchName: { type: String },
    },
    certifications: [String],
    rating: [{ appointmentId : String, clientEmail : String , clientUrl : String, clientName : String , rating : String , message : String , date : String }]
}, { timestamps: true });

const Professional = mongoose.model("Professional", ProfessionalSchema);

module.exports.Professional = Professional;

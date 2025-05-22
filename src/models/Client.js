const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    nic: String,
    password: String,
    googleId: String,
    phone: String,
    address: String,
    dob : String,
    url: String,
    status: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Professional" }],
    cards: [
      {
        cardNumber: String,
        expiryMonth: String,
        expiryYear: String,
        cardHolderName: String,
        cvv: String
      }
    ]
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", ClientSchema);

module.exports.Client = Client;
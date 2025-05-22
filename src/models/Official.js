const mongoose = require("mongoose");

  const OfficialSchema = new mongoose.Schema(
    {
      id: String,
      firstName: String,
      lastName: String,
      district: String,
      province : String,
      phone: String,
      type : String,
      url: String
    },
    { timestamps: true }
  );

const Official = mongoose.model("Official", OfficialSchema);

module.exports.Official = Official;
const mongoose = require("mongoose");

  const registryLocationSchema = new mongoose.Schema(
    {
      locationName: String,
      district:String,
      province: String,
      contactNumber: String,
      address: String
    },
    { timestamps: true }
  );

const RegistryLocation = mongoose.model("RegistryLocation", registryLocationSchema);

module.exports.RegistryLocation = RegistryLocation;
const mongoose = require("mongoose");

  const EmployeeSchema = new mongoose.Schema(
    {
      firstName: String,
      lastName: String,
      email: String,
      nic: String,
      password: String,
      phone: String,
      address: String,
      dob : String,
      type : String,
      url: String,
      status: String
    },
    { timestamps: true }
  );

const Employee = mongoose.model("employee", EmployeeSchema);

module.exports.Employee = Employee;
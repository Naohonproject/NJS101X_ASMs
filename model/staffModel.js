const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// defined staff Modlel
const staffSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  managerID: Schema.Types.ObjectId,
  doB: {
    type: Schema.Types.Date,
  },
  salaryScale: {
    type: Schema.Types.Number,
  },
  startDate: {
    type: Schema.Types.Date,
  },
  department: {
    type: String,
  },
  annualLeave: {
    type: Schema.Types.Decimal128,
  },
  imageUrl: {
    type: String,
  },
  workSessions: [
    {
      checkIn: {
        type: Schema.Types.Date,
      },
      checkOut: Schema.Types.Date,
      workPos: {
        type: String,
      },
    },
  ],
  annualLeaveRegisters: [
    {
      dayOff: {
        type: Schema.Types.Date,
      },
      reason: {
        type: String,
      },
      duration: {
        type: Schema.Types.Decimal128,
      },
    },
  ],

  tempInfor: [
    {
      temp: {
        type: Schema.Types.Number,
        required: true,
      },
      time: {
        type: Schema.Types.Date,
        required: true,
      },
    },
  ],

  vaccinationInfor: [
    {
      injectionOrder: {
        type: Schema.Types.Number,
        required: true,
      },
      vaccinationType: {
        type: String,
        required: true,
      },
      injectionDate: {
        type: Schema.Types.Date,
        required: true,
      },
    },
  ],

  positiveCovid: [
    {
      positiveDate: {
        type: Schema.Types.Date,
        required: true,
      },
      injectionTimes: {
        type: Number,
        required: true,
      },
    },
  ],
});

// export outside of module to create the instance of database
module.exports = mongoose.model("Staff", staffSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    requierd: true,
  },
  role: {
    type: String,
    requierd: true,
  },
  doB: {
    type: Schema.Types.Date,
    required: true,
  },
  salaryScale: {
    type: Schema.Types.Number,
    required: true,
  },
  startDate: {
    type: Schema.Types.Date,
    required: true,
  },
  department: {
    type: String,
    requird: true,
  },
  annualLeave: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  workSestions: [
    {
      checkIn: {
        type: Schema.Types.Date,
        required: true,
      },
      CheckOut: Schema.Types.Date,
      workPos: {
        type: String,
        required: true,
      },
    },
  ],
  annualLeaveRegisters: [
    {
      dayOff: {
        type: Schema.Types.Date,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      duration: {
        type: Schema.Types.Date,
        required: true,
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

  postiveCodvid: [
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

module.exports = mongoose.model("User", userSchema);

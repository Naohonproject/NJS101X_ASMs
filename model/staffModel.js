const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// definde staffModle
const staffSchema = new Schema({
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
    type: Schema.Types.Decimal128,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  workSesstions: [
    {
      checkIn: {
        type: Schema.Types.Date,
        required: true,
      },
      checkOut: Schema.Types.Date,
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
        type: Schema.Types.Decimal128,
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

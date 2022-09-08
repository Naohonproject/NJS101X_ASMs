const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// defined staff Model,this will map to the real data in mongodb, documents,that is the concept of mongodb,
//  each document will contain key - value pair like javascript object, they are called Bson

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
  confirm: [
    {
      StaffId: Schema.Types.ObjectId,
      ConfirmMonth: String,
    },
  ],
});

// export outside of module to create the instance of database
module.exports = mongoose.model("Staff", staffSchema);

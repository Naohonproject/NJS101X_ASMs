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
  rollCall: [
    {
      type: Schema.Types.ObjectId,
      ref: "RollCall",
    },
  ],
});

userSchema.methods.addToRollCall = function (rollCall) {
  const updatedRollCall = [...this.rollCall];
  updatedRollCall.push(rollCall._id);
  this.rollCall = updatedRollCall;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

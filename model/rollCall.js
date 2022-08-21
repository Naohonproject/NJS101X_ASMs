const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rollCallSchema = new Schema({
  workPosition: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: Date,
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("RollCall", rollCallSchema);

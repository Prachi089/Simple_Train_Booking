const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  number: Number,
  booked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

module.exports = mongoose.model('Seat', seatSchema);

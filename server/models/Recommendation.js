const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    zodiac: {
      type: String,
      required: true,
    },
    concern: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
    },
    budgetRange: {
      type: String,
    },
    gemstone: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
    },
    concernReason: {
      type: String,
    },
    metal: {
      type: String,
    },
    wearingDay: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
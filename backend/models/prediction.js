const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    disease: {
      type: String,
      enum: ["diabetes", "heart", "kidney", "liver"],
      required: true,
    },

    input: {
      type: Object,
      required: true,
    },

    prediction: {
      type: Number,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prediction", predictionSchema);
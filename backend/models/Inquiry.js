const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true
    },
    company: {
      type: String,
      trim: true,
      default: ""
    },
    projectType: {
      type: String,
      default: "Bespoke Business Website"
    },
    budget: {
      type: String,
      default: "Flexible"
    },
    timeline: {
      type: String,
      default: "Flexible"
    },
    message: {
      type: String,
      required: [true, "Message details are required"]
    },
    source: {
      type: String,
      enum: ["contact_form", "booking_modal", "scope_estimator"],
      default: "contact_form"
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "contacted", "closed"],
      default: "new"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Inquiry", inquirySchema);

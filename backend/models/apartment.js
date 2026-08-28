const mongoose = require("mongoose");

const PROPERTY_TYPES = ["apartment", "studio", "loft", "townhome"];
const LISTING_STATUSES = ["available", "rented"];

const apartmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    neighborhood: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Monthly rent is required"],
      min: [0, "Price cannot be negative"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
      // 0 = Studio on the Add Listing form.
    },
    bathrooms: {
      type: Number,
      required: [true, "Bathrooms is required"],
      min: [0, "Bathrooms cannot be negative"],
    },
    sqft: {
      type: Number,
      min: [0, "Square footage cannot be negative"],
    },
    type: {
      type: String,
      enum: {
        values: PROPERTY_TYPES,
        message: "Type must be apartment, studio, loft, or townhome",
      },
      default: "apartment",
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    photos: {
      type: [String],
      default: [],
      // First URL is the cover image, matching the Add Listing screen.
    },
    availableFrom: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: LISTING_STATUSES,
        message: "Status must be available or rented",
      },
      default: "available",
      lowercase: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Landlord is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;

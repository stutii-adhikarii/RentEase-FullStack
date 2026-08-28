const mongoose = require("mongoose");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login account for both tenants and landlords. Extra fields (name, phone, role)
// come from the Rent Ease register screen — the professionals sample only stored
// email + password.
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [EMAIL_PATTERN, "Enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // Store the bcrypt HASH only. Strength checks belong in the controller
      // while the password is still plain text.
    },
    role: {
      type: String,
      enum: {
        values: ["tenant", "landlord"],
        message: "Role must be tenant or landlord",
      },
      required: [true, "Role is required"],
    },
    profileImage: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;

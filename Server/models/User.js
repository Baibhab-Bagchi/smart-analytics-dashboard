import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails
    },
    password: {
      type: String,
      required: true,
    },
      role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const User = mongoose.model("User", userSchema);

export default User;
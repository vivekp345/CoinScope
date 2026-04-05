// src/models/User.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, "Name is required"],
      trim:      true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select:    false,
    },
  },
  { timestamps: true }
);

// ✅ Use return-based async hook instead of calling next()
// next() breaks in ES module context in Next.js
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
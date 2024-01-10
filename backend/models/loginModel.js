import mongoose from "mongoose";
import bcrypt from "bcrypt";
const loginSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

loginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

export const Login = mongoose.model("Login", loginSchema);

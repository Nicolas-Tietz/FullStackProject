import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "",
  },
  friends: {
    type: Array,
    default: [],
  },
  notifications: {
    type: Array,
    default: [],
  },
  additionalInfo: {
    type: Object,
    default: { birthDate: "", city: "", gender: "", job: "", phone: "" },
  },
  pendingRequests: {
    type: Array,
    default: [],
  },
});

export const User = mongoose.model("User", userSchema);

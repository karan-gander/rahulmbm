import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const AppointmentSchema = new Schema({
  appointmentId: { type: String, required: true }, // Manually assigned unique ID
  doctorEmail: { type: String }, // User's email
  fees: { type: Number }, // Payment amount
  patientName: { type: String },
  doctorName: { type: String },
  problem: { type: String },
  isHistory: { type: Boolean, default: false },
  paymentDone: { type: Boolean, default: false },
  medicine: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String },
    username: { type: String },
    location: { type: String },
    phone: { type: String },
    gender: { type: String },
    qualification: { type: String },
    experience: { type: Number },
    fees: { type: Number },
    appointments: { type: [AppointmentSchema], default: [] }, // Array of appointment objects
    razorpayid: { type: String },
    razorpaysecret: { type: String },
    category: { type: String },
    rating: { type: Number, default: 0 },
    isDoctor: { type: String, default: "none" },
    isApproved: { type: Boolean, default: false },
    about: { type: String },
    image: { type: String },
    JCash: { type: Number, default: 0 },
    noAppoint: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;

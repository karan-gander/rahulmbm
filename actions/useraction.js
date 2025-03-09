"use server";
import connectDB from "@/db/connectDB";
import User from "@/model/user";
import { v4 as uuidv4 } from "uuid";
import Razorpay from "razorpay";

export const initiate = async (
  doctorEmail,
  doctorName,
  patientEmail,
  patientName,
  problem,
  fees
) => {
  try {
    let user = await User.findOne({ email: doctorEmail });
    let secret = user.razorpaysecret;
    let id = user.razorpayid;

    if (!id || !secret) {
      throw new Error("Razorpay credentials are missing.");
    }

    // ✅ Connect to the database
    await connectDB();

    // ✅ Create a new Razorpay instance
    const razorpay = new Razorpay({
      key_id: id,
      key_secret: secret,
    });

    // ✅ Create a new order in Razorpay
    const options = {
      amount: fees * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save the payment request to the database
    await addAppointment(
      order.id,
      doctorEmail,
      doctorName,
      patientEmail,
      patientName,
      problem,
      fees
    );

    return { success: true, order, id };
  } catch (error) {
    console.error("Error initiating payment:", error);
    return { success: false, error: error.message };
  }
};

export const updateProfile = async (data, email) => {
  await connectDB();
  if (data?.username) {
    const existingUser = await fetchForUsername(data.username);
    if (existingUser && existingUser.email !== email) {
      return "Username already occupied";
    }
  }
  try {
    const updateData = { ...data }; // Clone data
    console.log("Data to update:", updateData); // Debug: Check what’s being sent
    console.log("Email for query:", email); // Debug: Verify email

    const result = await User.updateOne({ email }, { $set: updateData }); // Use $set for explicit updates
    console.log("Update result:", result); // Debug: Check MongoDB response

    if (result.modifiedCount === 0) {
      throw new Error(
        "No documents were updated. Either the user wasn’t found or no changes were made."
      );
    }

    return { success: true, result }; // Return a meaningful response
  } catch (error) {
    console.error("Error in updateProfile:", error);
    throw error; // Re-throw to be caught in handleSubmit
  }
};

export const fetchuser = async (email) => {
  await connectDB();
  try {
    const user = await User.findOne({ email }).lean(); // .lean() for plain JS object
    console.log("Fetched user:", user); // Debugging

    // Ensure all fields exist before returning
    return {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      gender: user?.gender || "",
      qualification: user?.qualification || "",
      experience: user?.experience || "",
      category: user?.category || "",
      fees: user?.fees || "",
      razorpayid: user?.razorpayid || "",
      razorpaysecret: user?.razorpaysecret || "",
      isDoctor: user?.isDoctor || "",
      history: user?.history || [],
      isApproved: user?.isApproved || false,
      rating: user?.rating || "",
      appointments: user?.appointments || [],
      about: user?.about || "",
      image: user?.image || "",
      JCash: user?.JCash || 0,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {};
  }
};

export const fetchDoctor = async (prefix) => {
  await connectDB();
  const users = await User.find({
    isDoctor: "doctor",
    isApproved: true,
    $or: [
      { name: { $regex: `^${prefix}`, $options: "i" } },
      { category: { $regex: `^${prefix}`, $options: "i" } },
    ],
  })
    .select(
      "name username fees category qualifications experience rating image"
    )
    .sort({ rating: -1 })
    .limit(7)
    .lean();

  return users;
};

export const addAppointment = async (
  id,
  doctorEmail,
  doctorName,
  patientEmail,
  patientName,
  problem,
  fees
) => {
  console.log(
    doctorEmail,
    doctorName,
    patientEmail,
    patientName,
    problem,
    fees
  );

  try {
    let paymentStatus = false;
    if (id == 0) {
      id = uuidv4();
      paymentStatus = true;
    }
    console.log("Generated appointment ID:", id);

    // Find doctor and add appointment details
    const doctor = await User.findOne({ email: doctorEmail });
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    doctor.appointments.push({
      appointmentId: id,
      patientName: patientName,
      problem: problem,
      paymentDone: paymentStatus,
    });

    await doctor.save();
    console.log("Appointment added to doctor:", doctorEmail);

    // Find patient and add appointment details
    const patient = await User.findOne({ email: patientEmail });
    if (!patient) {
      throw new Error("Patient not found");
    }
    patient.JCash += fees / 10;
    patient.appointments.push({
      appointmentId: id,
      doctorName: doctorName,
      doctorEmail: doctorEmail,
      fees: fees,
      paymentDone: false,
    });

    await patient.save();
    console.log("Appointment added to patient:", patientEmail);

    return { success: true };
  } catch (error) {
    console.error("Error adding appointment:", error);
    throw new Error(error.message || "Failed to add appointment");
  }
};

export const fetchByUsername = async (username) => {
  await connectDB();
  let u = await User.findOne({ username: username, isApproved: true }).lean();
  return u;
};

export const fetchForUsername = async (username) => {
  await connectDB();
  let u = await User.findOne({ username: username }).lean();
  return u;
};

export const doneAppointment = async (appointmentId, medicine) => {
  await connectDB();
  await User.updateOne(
    {
      isDoctor: "doctor", // Ensures the user is a doctor
      "appointments.appointmentId": appointmentId, // Finds the correct appointment
    },
    {
      $set: {
        "appointments.$.isHistory": true,
        "appointments.$.paymentDone": false,
      },
    }
  );

  await User.updateOne(
    {
      isDoctor: "patient", // Ensures the user is a doctor
      "appointments.appointmentId": appointmentId, // Finds the correct appointment
    },
    {
      $set: {
        "appointments.$.isHistory": true,
        "appointments.$.paymentDone": false,
        "appointments.$.medicine": medicine,
      },
    }
  );
};

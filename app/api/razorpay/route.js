import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import connectDB from "@/db/connectDB";
import User from "@/model/user";

export const POST = async (req) => {
  console.log("maja toh aa rha h");
  
  try {
    await connectDB();

    let body = await req.formData();
    body = Object.fromEntries(body);

    // Check if user exists with the given appointmentId and isDoctor = "doctor"
    let isValid = await User.findOne({
      isDoctor: "doctor",
      appointments: { $elemMatch: { appointmentId: body.razorpay_order_id } }
    });

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: "Order Id not found or user is not a doctor",
      });
    }

    // Fetch the secret from the valid doctor user
    const secret = isValid.razorpaysecret;

    let x = validatePaymentVerification(
      {
        order_id: body.razorpay_order_id,
        payment_id: body.razorpay_payment_id,
      },
      body.razorpay_signature,
      secret
    );

    if (x) {
      // Update `paymentDone` field inside the `appointments` array
      await User.updateOne(
        { "appointments.appointmentId": body.razorpay_order_id, isDoctor: "doctor" },
        { $set: { "appointments.$.paymentDone": "true" } }
      );

      await User.updateOne(
        { "appointments.appointmentId": body.razorpay_order_id, isDoctor: "patient" },
        { $set: { "appointments.$.paymentDone": "true" } }
      );

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/patientDashboard?paymentDone=true`
      );
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

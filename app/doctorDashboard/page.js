"use client";
import { fetchuser } from "@/actions/useraction";
import React, { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { useSession,signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { doneAppointment } from "@/actions/useraction";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [doctorData, setDoctorData] = useState({})
  const [medicine, setMedicine] = useState("Medicines: ")

  const handleDone = async (appointmentId) => {
    const input = prompt("Add Medicines");
  
    // If the user clicks Cancel or inputs an empty string, stop the function
    if (input === null || input.trim() === "") {
      return;
    }
  
    setMedicine((prev) => {
      const updatedMedicine = prev + " " + input;
      doneAppointment(appointmentId, updatedMedicine); // Use updatedMedicine immediately
      return updatedMedicine;
    });
  
    await doneAppointment(appointmentId, medicine);
    location.reload(); // Reload the page after completion
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return; // ✅ Ensure session is ready

      try {
        const u = await fetchuser(session.user.email);
        setDoctorData(u);
        if (u?.isDoctor === "none") {
          router.push("/DoctorRegistration");
        } else if (u?.isDoctor === "patient") {
          router.push("/patientDashboard");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status, router]); // ✅ Added dependencies

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  

  return (
    <div className="bg-gray-100">
      <div className="flex h-screen">
{console.log(doctorData)}
      <div className="w-1/4 bg-white p-6 shadow-lg flex flex-col justify-between">
  <div className="text-center">
    <Image
      src={doctorData?.image || "/avatar.png"}
      alt="Profile Picture"
      className="mx-auto rounded-full"
      width={100}
      height={100}
    />
    <h2 className="text-2xl font-semibold mt-4">{doctorData?.name}</h2>
    <p className="text-gray-600">{doctorData?.email}</p>
  </div>

  <div className="mt-6 space-y-3">
    <p className="text-gray-800 font-medium">Category: <span className="text-gray-600">{doctorData?.category}</span></p>
    <p className="text-gray-800 font-medium">Experience: <span className="text-gray-600">{doctorData?.experience} years</span></p>
    <p className="text-gray-800 font-medium">Fees: <span className="text-gray-600">₹{doctorData?.fees}</span></p>
    <p className="text-gray-800 font-medium">Phone: <span className="text-gray-600">{doctorData?.phone}</span></p>
    <p className="text-gray-800 font-medium">Location: <span className="text-gray-600">{doctorData?.location}</span></p>
    <p className="text-gray-800 font-medium">Qualification: <span className="text-gray-600">{doctorData?.qualification}</span></p>
          </div>
          <div className="text-center mt-6 flex gap-4">
            <Link href="/">
            <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Home
              </button>
            </Link>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

</div>



<div className="w-3/4 p-6">

    <div className="flex space-x-4 mb-4">
        <button id="appointment-tab" className="tab-btn bg-blue-500 text-white px-4 py-2 rounded">Appointments</button>
    </div>

   
    <div id="appointment-section" className="p-4 bg-white shadow rounded">
  <h2 className="text-lg font-semibold mb-2">Appointments</h2>

  {doctorData?.appointments?.length === 0 ? (
    <p className="text-gray-500">No appointments for today</p>
  ) : (
    <div className="space-y-4">
      {doctorData?.appointments?.filter((appointment) => appointment.paymentDone === true).map((appointment, index) => (
        <div
        key={appointment.appointmentId}
        className="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white"
      >
        <div>
          <p className="text-md font-medium">🧑‍⚕️ Patient Name: {appointment.patientName}</p>
          <p className="text-gray-600">🩺 Problem: {appointment.problem}</p>
          <p className="text-gray-600">
                          🗓 Date: {appointment.date.toLocaleString()}
                        </p>
        </div>
        <div className=" flex gap-3">
        <Link href={`/call?roomID=${appointment.appointmentId}`}>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
                            📞 Join
                          </button>
            </Link>
            <button className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              onClick={() => handleDone(appointment.appointmentId)}
            >
                            Done
                          </button>
        </div>
      </div>
      
      ))}
    </div>
  )}
</div>

</div>
</div>
    </div>
  )
 
};

export default Page;

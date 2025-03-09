"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchuser } from "@/actions/useraction";
import Image from "next/image";

const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState();
  const [selectedRole, setSelectedRole] = useState(null);
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
    // Fetch user only if session is available
    const fetchUserData = async () => {
      try {
        const u = await fetchuser(session.user.email);
        setUserData(u);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session, router]);

  useEffect(() => {
    // Redirect based on user type when userData is available
    if (userData) {
      if (userData.isDoctor === "doctor") {
        router.push("/doctorDashboard");
      } else if (userData.isDoctor === "patient") {
        router.push("/patientDashboard");
      }
    }
  }, [userData, router]);

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center min-h-screen">
      <div className="flex gap-10">
        {/* Doctor Card */}
        <div
          id="doctor-card"
          onClick={() => setSelectedRole("doctor")}
          className={`role-card w-72 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
            selectedRole === "doctor"
              ? "border-blue-500 shadow-md"
              : "border-gray-300"
          }`}
        >
          <Image
            className="rounded-t-lg w-full h-64 object-cover"
            src="/doctor.png"
            alt="Doctor"
            width={288}
            height={256}
          />
          <div className="p-5 text-center">
            <h5 className="text-2xl font-bold text-gray-900">Doctor</h5>
          </div>
        </div>

        {/* Patient Card */}
        <div
          id="patient-card"
          onClick={() => setSelectedRole("patient")}
          className={`role-card w-72 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
            selectedRole === "patient"
              ? "border-blue-500 shadow-md"
              : "border-gray-300"
          }`}
        >
          <Image
            className="rounded-t-lg w-full h-64 object-cover"
            src="/patient.png"
            alt="Patient"
            width={288}
            height={256}
          />
          <div className="p-5 text-center">
            <h5 className="text-2xl font-bold text-gray-900">Patient</h5>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        id="continue-btn"
        disabled={!selectedRole}
        className={`mt-6 px-6 py-3 text-lg font-semibold rounded-lg transition duration-300 ${
          selectedRole
            ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
        onClick={() => {
          if (selectedRole) {
            router.push(`/${selectedRole}Dashboard`);
          }
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default page;

"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useraction";
import Image from "next/image";

const PatientRegistration = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    isDoctor: "none",
  });

  useEffect(() => {
    if (form.isDoctor === "patient") {
      router.push("/patientDashboard");
    }
  }, [form.isDoctor, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.email) {
      getData();
    }
  }, [status, session]);

  const getData = async () => {
    if (!session?.user?.email) return;
    try {
      const userData = await fetchuser(session.user.email);
      setForm((prevForm) => ({
        ...prevForm,
        ...userData,
        isDoctor: userData.isDoctor || "none",
        image: userData.image || "",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedForm = { ...form, isDoctor: "patient" , image: session?.user?.image};
      const result = await updateProfile(updatedForm, session.user.email);
      if (!result.success) {
        alert(result);
        return;
      }
      alert("Profile updated successfully!");
      router.push("/patientDashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-xl flex md:flex-row flex-col max-w-4xl w-full p-8">
        <div className="md:w-1/2 p-4">
          <Image
            src="/image.png"
            alt="Patient Registration Image"
            width={500}
            height={300}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="md:w-1/2 p-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Patient Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
             <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
              <div className="flex items-center">
                <input type="radio" id="male" name="gender" value="male" className="mr-2" onChange={handleChange} />
                <label htmlFor="male" className="text-gray-700">Male</label>
                <input type="radio" id="female" name="gender" value="female" className="ml-4 mr-2" onChange={handleChange} />
                <label htmlFor="female" className="text-gray-700">Female</label>
                <input type="radio" id="other" name="gender" value="other" className="ml-4 mr-2" onChange={handleChange} />
                <label htmlFor="other" className="text-gray-700">Other</label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                placeholder="Enter your location"
                value={form.location}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button type="submit"
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;

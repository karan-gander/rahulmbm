"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useraction";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    qualification: "",
    experience: "",
    category: "",
    fees: "",
    razorpayid: "",
    razorpaysecret: "",
    isDoctor: "",
    about: "",
    image: "",
  });

  useEffect(() => {
    if (form.isDoctor === "doctor") {
      router.push("/doctorDashboard"); // ✅ Prevent access to registration
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
      console.log("Fetched user data:", userData); // Debug log
      setForm((prevForm) => ({
        ...prevForm,
        ...userData,
        isDoctor: userData.isDoctor || "none", // ✅ Ensure "doctor" is always set
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
      [name]: name === "experience" || name === "fees" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedForm = {
        ...form,
        isDoctor: "doctor",
        image: session?.user?.image,
      };
      const result = await updateProfile(updatedForm, session.user.email);
      if (!result.success) {
        alert(result);
        // Fix incorrect alert usage
        return;
      }
      console.log("Update result:", result);
      alert("Profile updated successfully!");

      // ✅ Redirect to doctorDashboard after successful update
      router.push("/doctorDashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 scroll-m-0">
      <div className="md:w-1/2 p-6 bg-white shadow-lg rounded-lg overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Doctor Registration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-900">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Username *</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Gender *</label>
            <div className="flex space-x-4">
              {["Male", "Female", "Other"].map((gender) => (
                <label key={gender} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    onChange={handleChange}
                    required
                    className="form-radio"
                  />
                  <span className="ml-2">{gender}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-900">Qualification *</label>
            <select
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Qualification</option>
              {["MBBS", "MD", "PhD"].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-900">Experience (Years) *</label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              min="0"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Specialization *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Specialization</option>
              {["Cardiology", "Neurology", "Orthopedics"].map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-900">Fees</label>
            <input
              type="number"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">About</label>
            <input
              type="text"
              name="about"
              value={form.about}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Razorpay ID *</label>
            <input
              type="text"
              name="razorpayid"
              value={form.razorpayid}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-900">Razorpay Secret *</label>
            <input
              type="text"
              name="razorpaysecret"
              value={form.razorpaysecret}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
      <div className="md:w-1/2 h-screen overflow-hidden bg-yellow-500">
        <div className="h-full overflow-hidden">
          <img
            src="https://cdn.dribbble.com/users/514480/screenshots/2091133/media/707a1f1c7d082f47858b783edaf64129.gif"
            alt="Patient Registration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

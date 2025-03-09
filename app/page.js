"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { fetchDoctor } from "@/actions/useraction";
import { useRouter } from "next/navigation";

const categories = [
  { title: "GYNAEECLOGY", image: "09ae5fb6-c2f3-49df-a737-b3024cc3c968.jpg" },
  { title: "CARDIOLOGY", image: "0150c6b4-db02-4302-8603-253c010b937b.jpg" },
  { title: "NEUROLOGY", image: "01a3c5c7-1acf-471b-9a25-955b8cf590f2.jpg" },
  { title: "DERMATOLOGY", image: "38e3926a-e69e-4d65-8399-d43204f7673f.jpg" },
  { title: "PEDIATRICS", image: "2977cee0-a7eb-4f89-849c-097d10a2d4b2.jpg" },
  { title: "ONCOLOGY", image: "43480d96-db5b-4db7-83bb-312dfb213ed0.jpg" },
  { title: "PSYCHIATRY", image: "37137de0-7e23-4e3f-91e3-2c96c2346a10.jpg" },
  { title: "RADIOLOGY", image: "download (11).jpg" },
  { title: "ENDOCRINOLOGY", image: "download (12).jpg" },
  { title: "OPTHALMOLOGY", image: "download (13).jpg" },
  { title: "Anesthesiology", image: "download (14).jpg" },
  { title: "UROLOGY", image: "images (23).jpg" },
  {
    title: "HEMATOLOGY",
    image:
      "blood-test-tube-icon-in-comic-style-hematology-cartoon-illustration-on-isolated-background-laboratory-flask-splash-effect-sign-business-concept-vector.jpg",
  },
  { title: "NEPHROLOGY", image: "images (24).jpg" },
  { title: "OBSTETRICIAN", image: "download (18).jpg" },
];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession(); // Get session data
  const [prefix, setprefix] = useState("");
  const [search, setsearch] = useState([]);
  const [seeMore, setSeeMore] = useState(false)

  const handleSearch = (username) => {
    setprefix("");
    router.push(`/${username}`);
  };

  useEffect(() => {
    getUsers();
  }, [prefix]);

  const getUsers = async () => {
    let u = await fetchDoctor(prefix);
    setsearch(u);
  };

  useEffect(() => {
    (function () {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = function () {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(arguments);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return function () {
              return target(prop, ...arguments);
            };
          },
        });
      }
      const onLoad = function () {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "Gff76WUIxvkxcIF_kFjgy";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
      };
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    })();
  }, []);

  // const [visibleItems, setVisibleItems] = useState(5);

  // const loadMoreItems = () => {
  //   setVisibleItems(categories.length);
  // };

  // const seeLessItems = () => {
  //   setVisibleItems(5);
  // };

  // useEffect(() => {
  //   // Hide "See More" button if all items are loaded
  //   if (visibleItems >= categories.length) {
  //     document.getElementById("seeMoreButton").style.display = "none";
  //   } else {
  //     document.getElementById("seeMoreButton").style.display = "block";
  //   }
  // }, [visibleItems]);

  return (
    <>
      <div className="bg-[#ffffff]">
        {/* Navigation Bar */}
        <div className="bg-[#BCd4E6] h-14 w-full flex items-center justify-between px-6 shadow-md">
          {/* Logo or Title */}
          <div className="text-[#2D4C73] font-bold text-2xl">JEEVni</div>

          {/* Navigation Links (Home, About Us, Contact) */}
          {/* <div className="hidden md:flex space-x-6">
      <a href="#" className="text-[#2D4C73] hover:text-[#FAD2E1] font-semibold">Home</a>
      <a href="#" className="text-[#2D4C73] hover:text-[#FAD2E1] font-semibold">About Us</a>
      <a href="#" className="text-[#2D4C73] hover:text-[#FAD2E1] font-semibold">Contact</a>
    </div> */}

          {/* Login/SignUp Links with Red Background */}
          {!session ? (
            <Link href="/login">
              <div className="flex space-x-2">
                  Login/Signup
              </div>
            </Link>
          ) : (
            <Link href="/Role">
              <div className="flex space-x-2">
                <a
                  href="#"
                  className="bg-[#f0efeb] text-[#2D4C73] px-5 py-2 rounded-lg hover:bg-[#FDE2E4]"
                >
                  Profile
                </a>
              </div>
            </Link>
          )}
        </div>

        {/* Search Bars */}
        {
          <div className="flex justify-center py-6 px-10">
            {/* Search bar for larger screens */}
            <input
              type="search"
              id="default-search"
              value={prefix}
              name="prefix"
              onChange={(e) => setprefix(e.target.value)}
              className="h-12 w-3/5 bg-[#ffffff] px-4 border border-[#BCd4E6] rounded-l-lg shadow-inner"
              placeholder="Search by name or category"
              required
            />
            {((prefix && search.length > 0) || search.length === 0) && (
              <div className="absolute z-10 w-[55%] mt-12 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ">
                {search.length > 0 ? (
                  search.map((user) => (
                    <div
                      key={user.name}
                      className="p-2 hover:bg-gray-100 text-black cursor-pointer flex gap-2"
                      onClick={() => handleSearch(user.username)}
                    >
                      <div className="w-9 h-9">
                        <img
                          src={user.image || "/avatar.png"}
                          alt="dp"
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[14px] font-bold">{user.name}</h3>
                        <span className="text-[8px]">{user.category}</span>
                        {/* <span className="text-[8px]">{user.experience}+ Years </span> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No users found</div>
                )}
              </div>
            )}

            {/* Responsive search bar for smaller screens */}
            <div className="flex justify-center py-6 px-10 sm:hidden">
              <input
                type="search"
                id="default-search"
                value={prefix}
                name="prefix"
                onChange={(e) => setprefix(e.target.value)}
                placeholder="Search by doctor name or category"
                className="h-12 w-full sm:w-3/5 bg-[#ffffff] px-4 border border-[#BCd4E6] rounded-l-lg shadow-inner"
              />
            </div>
          </div>
        }
      </div>

      <div className="overflow-hidden whitespace-nowrap p-4 mt-4 bg-gray-100">
        <div className="flex space-x-6 overflow-x-scroll">
          {/* Home Delivery */}
          <div
            id="homeDelivery"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
            onClick={() =>
              window.open(
                "https://api.whatsapp.com/send/?phone=%2B918655053484&text=Hi,%20I%20want%20to%20order%20medicines&type=phone_number&app_absent=0",
                "_blank"
              )
            }
          >
            <img
              className="rounded-t-lg"
              src="Untitled design (4).jpg"
              alt="Home Delivery"
            />
            <div className="p-5">
              <a href="#homeDelivery">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Home Delivery
                </h5>
                <p className="font-medium text-gray-700">
                  Get medicines at your doorstep
                </p>
              </a>
            </div>
          </div>

          {/* Online Consultancy */}
          <div
            id="onlineConsultancy"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#onlineConsultancy" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="Untitled design (5).jpg"
                alt="Online Consultancy"
              />
            </a>
            <div className="p-5">
              <a href="#onlineConsultancy">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Online Consultancy
                </h5>
                <p className="font-medium text-gray-700">
                  Consult with experts online
                </p>
              </a>
            </div>
          </div>

          {/* Fastest Ambulance */}
          <div
            id="fastestAmbulance"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#fastestAmbulance" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="Untitled design (6).jpg"
                alt="Fastest Ambulance"
              />
            </a>
            <div className="p-5">
              <a href="#fastestAmbulance">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Fastest Ambulance
                </h5>
                <p className="font-medium text-gray-700">
                  Emergency services at your doorstep
                </p>
              </a>
            </div>
          </div>

          {/* Clinic Appointment */}
          <div
            id="clinicAppointment"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#clinicAppointment" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="Untitled design (7).jpg"
                alt="Clinic Appointment"
              />
            </a>
            <div className="p-5">
              <a href="#clinicAppointment">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Clinic Appointment
                </h5>
                <p className="font-medium text-gray-700">
                  Book appointments easily
                </p>
              </a>
            </div>
          </div>

          {/* Placed As A Consultant */}
          <div
            id="placedConsultor"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#placedConsultor" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="Untitled design (8).jpg"
                alt="Placed As A Consultant"
              />
            </a>
            <div className="p-5">
              <a href="#placedConsultor">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Placed As A Consultant
                </h5>
                <p className="font-medium text-gray-700">
                  Expert advice at your service
                </p>
              </a>
            </div>
          </div>

          {/* Free Summary Report */}
          <div
            id="freeSummaryReport"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#freeSummaryReport" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="Untitled design (9).jpg"
                alt="Free Summary Report"
              />
            </a>
            <div className="p-5">
              <a href="#freeSummaryReport">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  Free Summary Report
                </h5>
                <p className="font-medium text-gray-700">
                  Get detailed reports for free
                </p>
              </a>
            </div>
          </div>

          {/* New Service 1 */}
          <div
            id="newService1"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#newService1" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="SEARCH DOCTOR OR CATEGORY (5).jpg"
                alt="New Service 1"
              />
            </a>
            <div className="p-5">
              <a href="#newService1">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  INSURANCE
                </h5>
                <p className="font-medium text-gray-700">
                  We'll helping as a mediator
                </p>
              </a>
            </div>
          </div>

          {/* New Service 2 */}
          <div
            id="newService2"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#newService2" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="SEARCH DOCTOR OR CATEGORY (6).jpg"
                alt="New Service 2"
              />
            </a>
            <div className="p-5">
              <a href="#newService2">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  CHATBOT
                </h5>
                <p className="font-medium text-gray-700">
                  Present chatbot for healthcare
                </p>
              </a>
            </div>
          </div>

          {/* New Service 3 */}
          <div
            id="newService3"
            className="max-w-sm bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#newService3" className="scroll-link">
              <img
                className="rounded-t-lg"
                src="SEARCH DOCTOR OR CATEGORY (8).jpg"
                alt="New Service 3"
              />
            </a>
            <div className="p-5">
              <a href="#newService3">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  MENTAL HEALTH
                </h5>
                <p className="font-medium text-gray-700">Are you okay ?</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center text-gray-800 font-bold text-2xl bg-slate-300 h-10">
        <p className="text-3xl font-bold tracking-wide uppercase text-center">
          Which section are you looking for?
        </p>
      </div>

      <div className="flex justify-center space-x-20 mt-10">
        <div className="text-center">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src="images (13).jpg"
            alt="Circular Image"
          />
          <p className="mt-1 text-slate-600 text-3xl font-bold">KIDS</p>
        </div>
        <div className="text-center">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src="87cbc2449d2d4eb8d7432e1a564ec8a4.jpg"
            alt="Circular Image"
          />
          <p className="mt-1 text-slate-600 text-3xl font-bold">OLD AGE</p>
        </div>
        <div className="text-center">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src="Untitled design (2).jpg"
            alt="Circular Image"
          />
          <p className="mt-1 text-slate-600 text-3xl font-bold">MALE</p>
        </div>
        <div className="text-center">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src="360_F_968112574_ppUbcOBSQskebeGVUu4hXv9wLIip0PEf.jpg"
            alt="Circular Image"
          />
          <p className="mt-1 text-slate-600 text-3xl font-bold">FEMALE</p>
        </div>
        <div className="text-center">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src="Untitled design.jpg"
            alt="Circular Image"
          />
          <p className="mt-1 text-slate-600 text-3xl font-bold">COMMON</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-20 mt-20 px-5 w-full">
        <img
          className="rounded-t-lg"
          src="Dr. Ashok Seth.jpg"
          alt="India best doctors"
        />
      </div>

      <div className="h-16 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center mt-5 shadow-lg">
        <h2 className="text-3xl font-bold tracking-wide uppercase">
          Categories
        </h2>
      </div>

      {/* Categories Grid */}
      <div className={`flex ${seeMore ? "flex-wrap" : "flex-nowrap"} justify-start mt-5`}>
  {categories
    .slice(0, seeMore ? categories.length : 5) // Show only 5 items when seeMore is false
    .map((category, index) => (
      <div key={index} className="w-1/5 p-4">
        <div className="grid-item">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <div className="grid-item-content mt-3">
            <h3 className="text-xl font-semibold text-center">
              {category.title}
            </h3>
          </div>
        </div>
      </div>
    ))}
</div>

{/* Button to toggle seeMore */}
<div className="mt-4 text-center">
  {!seeMore ? (
    <button
      onClick={() => setSeeMore(true)}
      className="bg-blue-500 text-white px-4 py-2 rounded-full"
    >
      See More
    </button>
  ) : (
    <button
      onClick={() => setSeeMore(false)}
      className="bg-blue-500 text-white px-4 py-2 rounded-full mt-2"
    >
      See Less
    </button>
  )}
</div>



    {/* <div className="container mx-auto py-8"> */}
        {/* <div id="gridContainer">Grid items will be inserted here</div> */}
        {/* <button id="seeMoreButton" className="button">
          See More
        </button> */}
        {/* <button
          id="seeLessButton"
          className="button"
          style={{ display: "none" }}
        >
          See Less
        </button> */}
      {/* </div> */}

      <div className="flex justify-center mt-10 px-5 w-full bg-[#bcd4e6]">
        <img src="Untitled design (3).jpg" alt="" className="w-full h-auto" />
      </div>

      <footer className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <h3 className="font-semibold mb-2">JEEvni</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For patients</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    Search for doctors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Search for clinics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Search for hospitals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Plus
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Covid Hospital listing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Care Clinics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Read health articles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Read about medicines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni drive
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Health app
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For doctors</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Profile
                  </a>
                </li>
              </ul>
              <h3 className="font-semibold mb-2 mt-4">For clinics</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    Ray by JEEvni
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Reach
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Ray Tab
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Pro
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For hospitals</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    Insta by JEEvni
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Qikwell by JEEvni
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Reach
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Drive
                  </a>
                </li>
              </ul>
              <h3 className="font-semibold mb-2 mt-4">For Corporates</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    Wellness Plans
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">More</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Developers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    PCS T&C
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Healthcare Directory
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    JEEvni Health Wiki
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Social</h3>
              <ul>
                <li>
                  <a href="#" className="hover:underline">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Youtube
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6">
            <div className="text-center">
              <span className="text-3xl font-semibold tracking-wider">
                JEEvni
              </span>
              <p className="text-sm mt-2">
                Copyright © 2025, JEEvni. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

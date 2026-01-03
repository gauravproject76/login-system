"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [errorotp, setErrorotp] = useState("");

  // ---------------- SEND OTP ----------------
  const sendotp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setError("");

    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    const data = await res.json();

    if (data.success) {
      setIsValid(true);
    } else {
      setError(data.message);
    }
  };

  // ---------------- VERIFY OTP ----------------
  const verifyotp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrorotp("Please enter 6 digit OTP");
      return;
    }

    setErrorotp("");

    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/dashboard");
    } else {
      setErrorotp(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-800">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-10 shadow-2xl">

        {isValid && (
          <button
            onClick={() => {
              setIsValid(false);
              setOtp("");
              setErrorotp("");
            }}
            className="flex items-center gap-1 mb-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}

        <h1 className="text-4xl font-bold text-white text-center mb-3">
          Login / Register
        </h1>

        <p className="text-gray-300 text-center text-lg">
          to book an appointment
        </p>

        {/* MOBILE FORM */}
        {!isValid && (
          <form onSubmit={sendotp}>
            <label className="text-gray-300 text-xl mt-10 block">
              Enter Mobile No.
            </label>

            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              className="border w-full h-10 mt-4 rounded-xl px-4 bg-transparent text-white outline-none border-white/20"
              placeholder="Enter Your Mobile No."
            />

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <button className="h-10 bg-white w-full text-black text-xl font-semibold rounded-xl mt-8">
              Send OTP
            </button>
          </form>
        )}

        {/* OTP FORM */}
        {isValid && (
          <form onSubmit={verifyotp}>
            <p className="text-green-400 text-center mt-4">
              OTP sent to mobile no {mobile}
            </p>

            <label className="text-gray-300 text-xl mt-10 block">
              Enter your OTP sent to you
            </label>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="border w-full h-10 mt-4 rounded-xl px-4 bg-transparent text-white outline-none border-white/20"
              placeholder="Enter 6 digit OTP"
            />

            {errorotp && (
              <p className="text-red-400 text-sm mt-2">{errorotp}</p>
            )}

            <button className="h-10 bg-white w-full text-black text-xl font-semibold rounded-xl mt-8">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

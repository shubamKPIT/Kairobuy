"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShoppingBag,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";

const inputClass =
  "w-full rounded-sm border border-zinc-300 bg-white py-2.5 pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900";

export default function RegisterPage() {
  const router = useRouter();

  const { googleLogin, user, isAuthLoaded } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthLoaded && user) {
      router.replace("/");
    }
  }, [isAuthLoaded, user, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await registerUser({
        name,
        email,
        password,
      });

      setSuccessMessage(
        "Account created successfully. Redirecting you to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1400);
    } catch (error) {
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setErrorMessage("Google sign up could not be completed.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await googleLogin(credentialResponse.credential);
      router.push("/");
    } catch (error) {
      setErrorMessage(
        error.message || "Google sign up failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthLoaded) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50">
        <p className="text-sm font-semibold text-zinc-600">
          Loading account...
        </p>
      </main>
    );
  }

  return (
    <section className="flex h-screen overflow-hidden bg-white text-zinc-900">
      {/* Left 60%: image panel (hidden on mobile). Change the image URL below. */}
      <div
        className="relative hidden bg-cover bg-center bg-no-repeat lg:block lg:w-[60%]"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/7081105/pexels-photo-7081105.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <Link
          href="/"
          className="absolute left-14 top-8 z-20 flex items-center gap-2.5 text-2xl font-extrabold uppercase tracking-[0.15em] text-white"
        >
          <FiShoppingBag size={26} />
          Kairobuy
        </Link>

        <div className="relative z-10 flex h-full flex-col justify-center px-14 text-white">
          <div className="max-w-xl">
            <h2 className="text-5xl font-bold leading-tight">
              Join Kairobuy and start shopping.
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/80">
              Create your account to save products, track orders, and check out
              faster.
            </p>
          </div>
        </div>

        <p className="absolute bottom-8 left-14 z-20 text-sm text-white/60">
          &copy; 2026 Kairobuy
        </p>
      </div>

      {/* Right 40%: register (light theme) */}
      <div className="flex w-full items-center justify-center overflow-y-auto bg-white px-6 py-4 lg:w-[40%]">
        <div className="w-full max-w-[400px]">
          {/* Brand link on mobile (image panel is hidden there) */}
          <Link
            href="/"
            className="mb-4 flex items-center gap-2 text-lg font-extrabold uppercase tracking-[0.15em] text-zinc-900 lg:hidden"
          >
            <FiShoppingBag size={20} />
            Kairobuy
          </Link>

          <h1 className="text-3xl font-bold text-zinc-900">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your details to get started.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              <FiAlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mt-4 flex items-start gap-3 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <FiCheckCircle size={18} className="mt-0.5 shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          <div className="mt-5 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setErrorMessage("Google sign up failed. Please try again.")
              }
              theme="outline"
              shape="rectangular"
              size="large"
              text="signup_with"
              width="400"
            />
          </div>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-500">or sign up with email</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Full name
              </label>
              <div className="relative">
                <FiUser
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Email
              </label>
              <div className="relative">
                <FiMail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <div className="relative">
                <FiLock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Confirm password
              </label>
              <div className="relative">
                <FiLock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || Boolean(successMessage)}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiUserPlus size={17} />
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-zinc-900 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
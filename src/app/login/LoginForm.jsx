"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import {
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiArrowRight,
  FiShoppingBag,
  FiMail,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full rounded-sm border border-zinc-300 bg-white py-3 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900";

const BG_IMAGE = "url('https://images.pexels.com/photos/7081100/pexels-photo-7081100.jpeg')";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login, googleLogin, user, isAuthLoaded } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectPath = searchParams.get("next") || "/";

  // Google button needs a pixel width (max 400): fit it to its container
  const googleWrapRef = useRef(null);
  const [googleWidth, setGoogleWidth] = useState(400);

  useEffect(() => {
    const el = googleWrapRef.current;
    if (!el) return;

    const update = () =>
      setGoogleWidth(Math.max(200, Math.min(400, Math.floor(el.clientWidth))));

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isAuthLoaded]);

  useEffect(() => {
    if (isAuthLoaded && user) {
      router.replace(redirectPath);
    }
  }, [isAuthLoaded, user, router, redirectPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setErrorMessage("Please enter your email address and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await login({
        email,
        password,
      });

      router.push(redirectPath);
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setErrorMessage("Google login could not be completed.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await googleLogin(credentialResponse.credential);
      router.push(redirectPath);
    } catch (error) {
      setErrorMessage(
        error.message || "Google login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Keep GoogleLogin's callbacks stable. If they change on every render,
  // the library re-runs google.accounts.id.initialize() each time.
  const googleSuccessRef = useRef(handleGoogleSuccess);
  googleSuccessRef.current = handleGoogleSuccess;

  const onGoogleSuccess = useCallback(
    (credentialResponse) => googleSuccessRef.current(credentialResponse),
    []
  );

  const onGoogleError = useCallback(() => {
    setErrorMessage("Google login failed. Please try again.");
  }, []);

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
    <section className="relative flex h-screen overflow-hidden bg-white text-zinc-900">
      {/* Mobile only: image as full-screen background behind the form */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:hidden"
        style={{ backgroundImage: BG_IMAGE }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Left 60%: image panel (hidden on mobile) */}
      <div
        className="relative hidden bg-cover bg-center bg-no-repeat lg:block lg:w-[60%]"
        style={{ backgroundImage: BG_IMAGE }}
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
              Your next favorite find starts here.
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/80">
              Save your favorites, track your orders, and check out in a few
              taps with your Kairobuy account.
            </p>
          </div>
        </div>

        <p className="absolute bottom-8 left-14 z-20 text-sm text-white/60">
          &copy; 2026 Kairobuy
        </p>
      </div>

      {/* Right 40%: login (transparent over image on mobile, white on desktop) */}
      <div className="relative z-10 flex w-full items-center justify-center overflow-y-auto bg-transparent px-6 py-6 lg:w-[40%] lg:bg-white">
        <div className="w-full max-w-[400px] rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
          {/* Brand link on mobile (image panel is hidden there) */}
          <Link
            href="/"
            className="mb-5 flex items-center gap-2 text-lg font-extrabold uppercase tracking-[0.15em] text-zinc-900 lg:hidden"
          >
            <FiShoppingBag size={20} />
            Kairobuy
          </Link>

          <h1 className="text-3xl font-bold text-zinc-900">Log in</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Welcome back. Enter your details to continue.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              <FiAlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div ref={googleWrapRef} className="mt-6 flex w-full justify-center overflow-hidden">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              theme="outline"
              shape="rectangular"
              size="large"
              text="continue_with"
              width={googleWidth}
            />
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-500">or log in with email</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
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

            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
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
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-zinc-900 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Log in"}
              {!isLoading && <FiArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-zinc-900 hover:underline"
            >
              Sign up
            </Link>
          </p>

          <Link
            href="/"
            className="mt-3 block text-center text-xs font-medium text-zinc-400 transition hover:text-zinc-900"
          >
            Continue browsing as guest
          </Link>
        </div>
      </div>
    </section>
  );
}
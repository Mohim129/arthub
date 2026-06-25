"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  Person,
  Envelope,
  Lock,
  Camera,
  Eye,
  EyeSlash,
} from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

/* ---------- imgBB upload helper ---------- */
async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
  if (!apiKey) throw new Error("Image upload API key is missing.");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed.");

  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Upload failed.");

  return json.data.url; // the direct image URL
}
/* ------------------------------------------ */

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Image upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Image selection handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";

      // If a file was selected, upload it first
      if (avatarFile) {
        setUploading(true);
        toast.loading("Uploading profile picture…", { id: "upload" });
        imageUrl = await uploadToImgBB(avatarFile);
        toast.success("Profile picture uploaded!", { id: "upload" });
        setUploading(false);
      }

      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        role,
        image: imageUrl || undefined,
      });

      if (signUpError) {
        toast.error(signUpError.message || "Sign up failed.");
        return;
      }

      toast.success("Account created! Redirecting…");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard?login=true",
        additionalData: { role },
      });
      if (error) {
        toast.error(error.message || "Google sign up failed.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 md:py-20 px-gutter bg-background">
      <Toaster position="top-right" toastOptions={{ className: "text-sm" }} />
      <div className="w-full max-w-[28rem] bg-surface rounded-xl shadow-lg p-md md:p-lg border border-outline-variant/20">
        {/* Logo & title */}
        <div className="text-center mb-lg">
          <Link
            href="/"
            className="font-h1-desktop text-h1-mobile md:text-h1-desktop font-bold text-primary"
          >
            ArtHub
          </Link>
          <p className="text-on-surface-variant mt-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Full Name
            </label>
            <div className="relative">
              <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-base text-on-surface"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Email
            </label>
            <div className="relative">
              <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-base text-on-surface"
              />
            </div>
          </div>

          {/* Profile Picture Upload (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Profile Picture{" "}
              <span className="font-normal normal-case tracking-normal text-outline">
                (optional)
              </span>
            </label>

            <div className="flex items-center gap-4">
              {/* Preview or placeholder */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors shrink-0"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-outline" />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary font-semibold text-sm hover:underline self-start"
                >
                  Upload image
                </button>
                <p className="text-[11px] text-outline">
                  JPG, PNG or GIF (Max 5 MB)
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Password with visibility toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="•••••••• (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-base text-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeSlash className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password with visibility toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-base text-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeSlash className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              I am a
            </label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-2 px-3 sm:py-2 sm:px-4 rounded-lg font-semibold border-2 transition-all text-sm ${
                  role === "user"
                    ? "border-primary bg-primary-container text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole("artist")}
                className={`flex-1 py-2 px-3 sm:py-2 sm:px-4 rounded-lg font-semibold border-2 transition-all text-sm ${
                  role === "artist"
                    ? "border-primary bg-primary-container text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                Artist
              </button>
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full font-bold mt-4"
            isLoading={loading || uploading}
          >
            {uploading
              ? "Uploading image..."
              : loading
                ? "Creating account..."
                : "Sign Up"}
          </Button>
        </form>

        <div className="flex items-center my-md">
          <hr className="flex-1 border-outline-variant" />
          <span className="mx-sm text-outline text-sm">or</span>
          <hr className="flex-1 border-outline-variant" />
        </div>

        {/* Google OAuth */}
        <Button
          variant="bordered"
          className="w-full border-outline-variant text-on-surface font-semibold hover:bg-surface-container-low transition-colors"
          onPress={handleGoogleSignUp}
        >
          <svg className="w-5 h-5 mr-sm" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>

        <p className="text-center mt-md text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

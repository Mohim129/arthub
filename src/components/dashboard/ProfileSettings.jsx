"use client";
import { useState, useEffect, useRef } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { toast } from "react-hot-toast";
import { Person, Camera } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";

export default function ProfileSettings() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null); // File object
  const [avatarPreview, setAvatarPreview] = useState(""); // data URL for preview

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Pre‑fill form when session loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      // If user already has an image URL, show it as preview
      if (user.image) {
        setAvatarPreview(user.image);
      }
    }
  }, [user]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size (max 5 MB)
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setProfileSaving(true);
    try {
      // Build update payload – email is NOT included
      const updateData = {
        name: name.trim(),
        bio: bio.trim(),
      };

      // For now, if a new avatar file is selected, send the data URL.
      // Later, you'll upload to imgBB and send the returned URL instead.
      if (avatar && avatarPreview) {
        updateData.image = avatarPreview; // base64 data URL (temporary)
      }

      await authClient.updateUser(updateData);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="text-center py-20 text-on-surface-variant">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full mb-4" />
        <p>Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-error">
        You must be logged in to view your profile.
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-h1-desktop text-h1-desktop text-on-surface">
          Profile Settings
        </h1>
        <p className="text-on-surface-variant font-body-large text-body-large">
          Manage your personal details, biography, and password configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        {/* Left Column – Avatar */}
        <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-center text-center">
          <div className="relative w-28 h-28 rounded-full bg-secondary-container overflow-hidden flex items-center justify-center border border-outline-variant/30 mb-sm group cursor-pointer">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <Person className="w-16 h-16 text-on-surface-variant" />
            )}
            {/* Upload overlay */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="text-white w-6 h-6" />
            </div>
          </div>
          <h3 className="font-h3 text-h3 text-on-surface">{name}</h3>
          <p className="text-body-small text-on-surface-variant mb-md">
            {email}
          </p>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <p className="text-left text-[11px] text-outline mt-1 px-1">
            Click the avatar to upload a profile picture. (Max 5 MB)
          </p>
        </div>

        {/* Right Columns – Forms */}
        <div className="lg:col-span-2 space-y-md">
          {/* Personal Information */}
          <div className="bg-surface-container-lowest p-md md:p-lg rounded-xl shadow-sm border border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant/20 pb-sm mb-md">
              Personal Information
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps font-label-caps text-on-surface-variant">
                    Full Name
                  </label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border-outline-variant"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps font-label-caps text-on-surface-variant">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-on-surface outline-none opacity-75 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-outline mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps font-label-caps text-on-surface-variant">
                  Biography
                </label>
                <TextArea
                  placeholder="Tell the community about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="rounded-lg border-outline-variant"
                />
              </div>
              <div className="flex justify-end pt-xs">
                <Button
                  type="submit"
                  isLoading={profileSaving}
                  className="bg-primary text-on-primary font-bold px-lg py-sm rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-surface-container-lowest p-md md:p-lg rounded-xl shadow-sm border border-outline-variant/20">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant/20 pb-sm mb-md">
              Security & Password
            </h3>
            <form onSubmit={handlePasswordSave} className="space-y-md">
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps font-label-caps text-on-surface-variant">
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-lg border-outline-variant"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps font-label-caps text-on-surface-variant">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-lg border-outline-variant"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps font-label-caps text-on-surface-variant">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-lg border-outline-variant"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-xs">
                <Button
                  type="submit"
                  isLoading={passwordSaving}
                  className="bg-primary text-on-primary font-bold px-lg py-sm rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-sm"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

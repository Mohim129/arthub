"use client";
import { useState } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { toast } from "react-hot-toast";
import { Person } from "@gravity-ui/icons";
 
export default function ProfileSettings({ initialName = "Alex Rivera", initialEmail = "alex.r@email.com", initialBio = "Passionate art collector and curator.", initialAvatar = "" }) {
  // Profile state
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [bio, setBio] = useState(initialBio);
  const [avatar, setAvatar] = useState(initialAvatar);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Simulate successful save
    toast.success("Profile updated successfully!");
  };
 
  const handlePasswordSave = (e) => {
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
    // Simulate successful save
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
 
  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-h1-desktop text-h1-desktop text-on-surface">Profile Settings</h1>
        <p className="text-on-surface-variant font-body-large text-body-large">
          Manage your personal details, biography, and password configuration.
        </p>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        {/* Left Column: Avatar Preview */}
        <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-secondary-container overflow-hidden flex items-center justify-center border border-outline-variant/30 mb-sm relative group">
            {avatar ? (
              <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
            ) : (
              <Person className="w-16 h-16 text-on-surface-variant" />
            )}
          </div>
          <h3 className="font-h3 text-h3 text-on-surface">{name}</h3>
          <p className="text-body-small text-on-surface-variant mb-md">{email}</p>
          <div className="w-full">
            <Input
              label="Avatar Image URL"
              placeholder="https://example.com/avatar.jpg"
              size="sm"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="text-left text-body-small"
            />
            <p className="text-left text-[11px] text-outline mt-1 px-1">
              Provide a web image URL to customize your profile picture.
            </p>
          </div>
        </div>
 
        {/* Right Columns: Edit Info & Password Forms */}
        <div className="lg:col-span-2 space-y-md">
          {/* Edit Information Card */}
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
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border-outline-variant"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps font-label-caps text-on-surface-variant">
                    Email Address
                  </label>
                  <Input
                    placeholder="alex.r@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border-outline-variant"
                  />
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
                  className="bg-primary text-on-primary font-bold px-lg py-sm rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
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

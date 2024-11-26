"use client";
import { useLiff } from "@/components/LiffProvider";
import { User } from "lucide-react";

export function UserProfile() {
  const { profile } = useLiff();

  if (!profile) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 rounded-lg p-2">
      {/* {profile.pictureUrl ? (
        <img
          src={profile.pictureUrl}
          alt={profile.displayName}
          className="h-8 w-8 rounded-full"
        />
      ) : (
        <User className="h-8 w-8" />
      )} */}
      <span className="text-sm font-medium">{profile.displayName}</span>
    </div>
  );
}

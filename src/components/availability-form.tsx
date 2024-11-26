"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, CircleHelp } from "lucide-react";
import { EventStatus } from "@/schemas/event";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLiff } from "./LiffProvider";


type Props = {
  dates: { date: Date; time: string }[];
  onSubmit: (responses: { date: Date; time: string; status: EventStatus }[], displayName: string) => void;
  onCancel: () => void;
};

export function AvailabilityForm({ dates, onSubmit, onCancel }: Props) {
  const [responses, setResponses] = useState<Record<string, EventStatus>>({});
  const {profile}= useLiff();
  const [displayName, setDisplayName] = useState(profile?.displayName || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedResponses = dates.map((date) => ({
      date: date.date,
      time: date.time,
      status: responses[`${date.date.toISOString()}-${date.time}`] || EventStatus.NO,
    }));
    onSubmit(formattedResponses, displayName);
  };

  const getButtonStyle = (status: EventStatus | undefined) => {
    switch (status) {
      case EventStatus.YEA:
        return "bg-green-100 hover:bg-green-200 text-green-700 ring-green-500";
      case EventStatus.NO:
        return "bg-red-100 hover:bg-red-200 text-red-700 ring-red-500";
      case EventStatus.MAYBE:
        return "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 ring-yellow-500";
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-700";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="displayName">Your Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <Label>Select Your Availability</Label>
        <div className="grid gap-4">
          {dates.map((date) => {
            const key = `${date.date.toISOString()}-${date.time}`;
            const status = responses[key];

            return (
              <div key={key} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <div className="font-medium">
                    {date.date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-500">{date.time}</div>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: EventStatus.YEA, icon: Check, label: "Available" },
                    { value: EventStatus.NO, icon: X, label: "Unavailable" },
                    { value: EventStatus.MAYBE, icon: CircleHelp, label: "Maybe" },
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                    
                      type="button"
                      key={value}
                      onClick={() => setResponses((prev) => ({ ...prev, [key]: value }))}
                      className={cn(
                        "p-2 rounded-full transition-all duration-200 ring-2 ring-opacity-0 hover:ring-opacity-100",
                        status === value ? "ring-opacity-100" : "",
                        getButtonStyle(status === value ? value : undefined)
                      )}
                      title={label}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!displayName}>
          Save Availability
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, CircleHelp } from "lucide-react";
import { EventStatus } from "@/schemas/event";

type Props = {
  dates: Date[];
  onSubmit: (responses: { date: Date; status: EventStatus }[]) => void;
  onCancel: () => void;
};

export function AvailabilityForm({ dates, onSubmit, onCancel }: Props) {
  const [responses, setResponses] = useState<Map<string, EventStatus>>(new Map());

  const handleStatusChange = (date: Date, status: EventStatus) => {
    setResponses(new Map(responses.set(date.toISOString(), status)));
  };

  const handleSubmit = () => {
    const formattedResponses = Array.from(responses.entries()).map(([dateStr, status]) => ({
      date: new Date(dateStr),
      status,
    }));
    onSubmit(formattedResponses);
  };

  const getButtonClass = (selected: boolean) => 
    selected ? "bg-muted" : "hover:bg-muted/50";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {dates.map((date) => {
          const currentStatus = responses.get(date.toISOString());
          return (
            <div key={date.toISOString()} className="flex items-center gap-4">
              <span className="w-32 text-sm">{date.toLocaleDateString()}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={getButtonClass(currentStatus === EventStatus.YEA)}
                  onClick={() => handleStatusChange(date, EventStatus.YEA)}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={getButtonClass(currentStatus === EventStatus.MAYBE)}
                  onClick={() => handleStatusChange(date, EventStatus.MAYBE)}
                >
                  <CircleHelp className="h-4 w-4 text-yellow-500" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={getButtonClass(currentStatus === EventStatus.NO)}
                  onClick={() => handleStatusChange(date, EventStatus.NO)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleSubmit} className="flex-1 bg-[#00B900] hover:bg-[#009900]">
          Submit
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}

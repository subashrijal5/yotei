"use client";

import * as React from "react";
import { Input } from "./input";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  return (
    <Input
      type="text"
      value={`${value}〜`}
      onChange={(e) => {
        // Remove the 〜 suffix if present and update the value
        const newValue = e.target.value.replace('〜', '');
        onChange(newValue);
      }}
      className="w-[90px] text-center text-sm bg-muted/50 border-muted-foreground/20"
    />
  );
}

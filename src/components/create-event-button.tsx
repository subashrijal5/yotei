"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateEventForm } from "./create-event-form";
import { Plus } from "lucide-react";

export function CreateEventButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#00B900] hover:bg-[#009900]">
          <Plus className="mr-2 h-4 w-4" /> Create New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Create a new event and share it with your friends to find the best date.
          </DialogDescription>
        </DialogHeader>
        <CreateEventForm />
      </DialogContent>
    </Dialog>
  );
}
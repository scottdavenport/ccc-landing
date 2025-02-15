'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SponsorUpload } from "./SponsorUpload";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A dialog component that contains the sponsor management form
 * 
 * @remarks
 * This component provides:
 * - A button to trigger the dialog
 * - A modal dialog containing the sponsor upload form
 * - Clean UI separation between trigger and form
 */
export function SponsorDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="default"
          className={cn(
            "font-semibold tracking-tight",
            "bg-primary/90 hover:bg-primary text-white",
            "shadow-sm hover:shadow transition-all duration-200"
          )}
        >
          Add Sponsor
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        aria-describedby="sponsor-form-description"
      >
        <DialogHeader>
          <DialogTitle>Add New Sponsor</DialogTitle>
          <p id="sponsor-form-description" className="text-sm text-gray-500">
            Fill out the form below to add a new sponsor to the website.
          </p>
        </DialogHeader>
        <SponsorUpload />
      </DialogContent>
    </Dialog>
  );
}

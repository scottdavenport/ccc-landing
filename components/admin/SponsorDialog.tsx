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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Sponsor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Sponsor</DialogTitle>
        </DialogHeader>
        <SponsorUpload />
      </DialogContent>
    </Dialog>
  );
}

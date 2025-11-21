"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RequiredStar from "@/components/common/RequiredStar";

// ✅ Validation Schema
const ticketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(70, "Subject must be under 70 characters"),
  category: z.string().nonempty("Category is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(800, "Description cannot exceed 800 words"),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file ||
        (["image/png", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024),
      "Only PNG or JPG files under 10MB are allowed"
    ),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface AddNewTicketModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddNewTicketModal({ open, onClose }: AddNewTicketModalProps) {
  const [fileName, setFileName] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    mode: "onChange",
  });

  const subject = watch("subject") || "";
  const description = watch("description") || "";

  const onSubmit = (data: TicketFormData) => {
    console.log("✅ New Ticket Submitted:", data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-md 
          max-h-[80vh] 
          overflow-y-auto 
          rounded-xl 
          p-6 
          space-y-4
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Create New Ticket
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Subject <RequiredStar />
            </label>
            <div className="relative">
              <Input
                {...register("subject")}
                placeholder="Brief description of your issue"
                maxLength={70}
                className="mt-1"
              />
              <span className="absolute right-2 bottom-2 text-xs text-orange-500">
                {subject.length}/70 Characters
              </span>
            </div>
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category <RequiredStar />
            </label>
            <Select
              onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description <RequiredStar />
            </label>
            <div className="relative">
              <Textarea
                {...register("description")}
                placeholder="Please provide detailed description of your issue"
                className="mt-1 min-h-[100px]"
              />
              <span className="absolute right-2 bottom-2 text-xs text-orange-500">
                {description.split(" ").filter(Boolean).length}/800 Words
              </span>
            </div>
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">Attachments</label>
            <div className="mt-2 border border-dashed rounded-lg p-5 flex flex-col items-center justify-center bg-gray-50">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <label className="text-sm text-gray-600 cursor-pointer text-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      setValue("file", file, { shouldValidate: true });
                    }
                  }}
                />
                {fileName ? (
                  <span className="font-medium text-gray-800">{fileName}</span>
                ) : (
                  <>
                    Upload Images <br />
                    <span className="text-xs text-gray-400">
                      PNG, JPG up to 10MB
                    </span>
                  </>
                )}
              </label>
            </div>
            {errors.file && (
              <p className="text-xs text-red-500 mt-1">{errors.file.message}</p>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className={`rounded-full text-white ${isValid
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Submit Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

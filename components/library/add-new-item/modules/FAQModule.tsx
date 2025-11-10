"use client";
import React from "react";
import { AddFAQForm } from "@/components/library/AddFAQForm";
import type { ModuleProps } from "./types";

export const FAQModule: React.FC<ModuleProps> = ({ updateId, onCancel, onSave }) => {
  return <AddFAQForm mode="library" updateId={updateId} onCancel={onCancel} onSave={onSave} />;
};

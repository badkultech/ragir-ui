import { z } from "zod";
import {
  titleField,
  descriptionField,
  locationField,
  timeField,
  packingField,
} from "../fields";

export const addEventSchema = z.object({
  title: titleField,
  description: descriptionField,
  location: locationField,
  time: timeField,
  packing: packingField
});

export type AddEventFormData = z.infer<typeof addEventSchema>;

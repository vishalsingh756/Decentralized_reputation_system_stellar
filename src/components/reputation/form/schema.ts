
import * as z from "zod";

export const formSchema = z.object({
  address: z.string().min(56).max(56, {
    message: "Stellar address must be exactly 56 characters",
  }),
  category: z.enum(["general", "leasing", "return", "communication"], {
    required_error: "Please select a category for your feedback",
  }),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please select a rating",
  }),
  comment: z.string().min(3, {
    message: "Comment must be at least 3 characters",
  }).max(200, {
    message: "Comment cannot exceed 200 characters",
  }),
});

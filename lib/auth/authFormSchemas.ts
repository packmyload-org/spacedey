import { z } from "zod";
import { validatePasswordStrength } from "@/lib/auth/passwordPolicy";
import { normalizeEmail } from "@/lib/utils/email";

function isBlank(value: unknown) {
  return typeof value !== "string" || value.trim().length === 0;
}

const requiredString = (message: string) =>
  z.string().trim().min(1, message);

const emailSchema = z.preprocess(
  (value) => normalizeEmail(String(value || "")),
  z.email("Enter a valid email address.")
);

const passwordStrengthSchema = z
  .string()
  .min(1, "Password is required.")
  .superRefine((value, context) => {
    const validation = validatePasswordStrength(value);

    if (!validation.isValid) {
      context.addIssue({
        code: "custom",
        message: validation.message || "Password is too weak.",
      });
    }
  });

export const signupFormSchema = z
  .object({
    firstName: requiredString("First name is required."),
    lastName: requiredString("Last name is required."),
    email: emailSchema,
    password: passwordStrengthSchema,
    confirm: requiredString("Confirm password is required."),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirm) {
      context.addIssue({
        code: "custom",
        path: ["confirm"],
        message: "Passwords do not match.",
      });
    }
  });

export const loginFormSchema = z.object({
  email: emailSchema,
  password: requiredString("Password is required."),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = z
  .object({
    token: z.string().superRefine((value, context) => {
      if (isBlank(value)) {
        context.addIssue({
          code: "custom",
          message: "Reset token is required.",
        });
      }
    }),
    password: passwordStrengthSchema,
    confirm: requiredString("Confirm password is required."),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirm) {
      context.addIssue({
        code: "custom",
        path: ["confirm"],
        message: "Passwords do not match.",
      });
    }
  });

export type AuthFieldErrors = Record<string, string>;

export function getFieldErrors(error: z.ZodError): AuthFieldErrors {
  const fieldErrors = error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(fieldErrors)
      .map(([field, messages]) => {
        const firstMessage = Array.isArray(messages) ? messages[0] : undefined;
        return [field, firstMessage || "Invalid value."] as const;
      })
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}

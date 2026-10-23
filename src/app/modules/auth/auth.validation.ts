import z from "zod";

const registrationSchema = z.object({
	name: z
		.string("Provide your name")
		.min(3, "Name must at least 3 characters long")
		.max(100, "Name not longer than 100 characters long"),
	email: z.email("Invalid email address").trim().toLowerCase(),
	password: z
		.string()
		.min(8, "Password Must Minimum 8 Characters Long.")
		.regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
		.regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
		.regex(/[0-9]/, "Password must contain at least 1 Number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least 1 Special Character",
		),
});

const loginSchema = z.object({
	email: z.email("Invalid email address").trim().toLowerCase(),
	password: z.string()
		.min(8, "Password Must Minimum 8 Characters Long.")
		.regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
		.regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
		.regex(/[0-9]/, "Password must contain at least 1 Number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least 1 Special Character",
		),
});

export const AuthValidation = {
	registrationSchema,
	loginSchema,
}
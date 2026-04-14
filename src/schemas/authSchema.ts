import {z} from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, "আপনার পুরো নাম লিখুন"),
    email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
    phone: z.string().min(11, "কমপক্ষে ১১ ডিজিটের ফোন নম্বর দিন"),
    password: z.string().min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"),
    role: z.enum(["tenant", "landlord"]),
})

// Infer the type from the schema for TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>
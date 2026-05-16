import {z} from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, "আপনার পুরো নাম লিখুন"),
    email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
    phone: z.string().min(11, "কমপক্ষে ১১ ডিজিটের ফোন নম্বর দিন"),
    password: z.string()
        .min(8, "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে")
        .regex(/[A-Z]/, "কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে")
        .regex(/[a-z]/, "কমপক্ষে একটি ছোট হাতের অক্ষর থাকতে হবে")
        .regex(/[0-9]/, "কমপক্ষে একটি সংখ্যা থাকতে হবে"),
})
export const loginSchema = z.object({
    email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
    password: z.string().min(8, "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে"),
})

// Infer the type from the schema for TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
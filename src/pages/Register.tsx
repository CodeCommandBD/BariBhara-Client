import { Link } from "react-router-dom";
import { useAuth } from "@/Hook/useAuth";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {registerSchema, type RegisterFormData} from "@/schemas/authSchema"
import { useState } from "react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const  {registerUser, isLoading, error} = useAuth()
  const {register, handleSubmit, formState: {errors}} = useForm<RegisterFormData>({
    defaultValues:{
      fullName:"",
      email: "",
      phone: "",
      password: ""
    },
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: any) =>{
    registerUser(data)
  }
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex h-screen overflow-hidden">
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 z-0 select-none">
            {/* Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img 
                className="w-full h-full object-cover" 
                alt="Modern luxury apartment" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX8DO4CmKUl6knEnt0Yq_uvZVNqOR9hnE6tQCYNuT389zdcApGExYw430J3mPAJp0GMQgaBqK1piURZLWYK-dqjoDijoLxZDIwbccmsS4_eYiDAezHlzZLXHSBZcP5Sg-idRvYurADeTe0Gs6A3Cf6XU-oIp-7hvMOdzZm7extxAJSaqZJIWnOJNmk2gTGQFaIjbQivA2IP4ZHvE9j4GOzOdse0CC63qn4zVNIcgVpEsbQqIaWnEoM6O1OZ0YHFqynNldCzY7Y4M8p"
            />
          </div>
          {/* Glass Overlay Content - Increased opacity for readability */}
          <div className="relative z-20 max-w-lg space-y-8 p-12 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              আপনার স্বপ্নের <br /><span className="text-primary-fixed drop-shadow-sm">ঠিকানা খুঁজুন</span>
            </h1>
            <p className="text-white text-lg leading-relaxed font-medium drop-shadow-sm">
              বাংলাদেশের সবচেয়ে নিরাপদ এবং আধুনিক রেন্টাল প্ল্যাটফর্মে আপনাকে স্বাগতম। আপনার আবাসন ব্যবস্থা এখন আগের চেয়ে অনেক বেশি সহজ।
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-white drop-shadow-sm">
                <span className="material-symbols-outlined bg-primary/40 p-2 rounded-full">verified_user</span>
                <span className="font-semibold font-headline">যাচাইকৃত বাড়িওয়ালা এবং ভাড়াটিয়া</span>
              </div>
              <div className="flex items-center gap-4 text-white drop-shadow-sm">
                <span className="material-symbols-outlined bg-primary/40 p-2 rounded-full">payments</span>
                <span className="font-semibold font-headline">নিরাপদ এবং স্বচ্ছ পেমেন্ট গেটওয়ে</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-1/2 bg-surface-container-high flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-3">
              <h2 className="font-headline text-4xl font-bold text-on-surface">অ্যাকাউন্ট তৈরি করুন</h2>
              <p className="text-on-surface-variant font-medium">Bari Bhara এ নতুন? শুরু করতে নিচের তথ্যগুলো পূরণ করুন।</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* error message */}
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                  {error.message}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">আপনার নাম</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                    <input
                        {...register("fullName")}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 shadow-sm" 
                        placeholder="পুরো নাম লিখুন" 
                        type="text" 
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message as string}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">ইমেইল</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                      <input
                        {...register("email")}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm" 
                        placeholder="example@mail.com" 
                        type="email" 
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">ফোন নম্বর</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">phone_iphone</span>
                      <input
                        {...register("phone")}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm" 
                        placeholder="01XXX-XXXXXX" 
                        type="tel" 
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">পাসওয়ার্ড</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                    <input
                        {...register("password")}
                        className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm" 
                        placeholder="••••••••" 
                        type={ showPassword ? 'text' : 'password'} 
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
                    <span
                     onClick={()=>setShowPassword(!showPassword)} 
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer">{showPassword ? "visibility":"visibility_off"}</span>
                  </div>
                </div>
              </div>

              <button 
              disabled={isLoading}
              className="w-full py-5 btn-brand rounded-xl font-bold text-lg">
               {isLoading ? "রেজিস্ট্রেশন হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
              </button>
            </form>

            <div className="flex flex-col items-center gap-4 mt-8">
              <p className="text-center text-on-surface-variant font-headline">
                ইতিমধ্যেই অ্যাকাউন্ট আছে? <Link className="text-primary font-bold hover:underline" to="/login">লগইন করুন</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
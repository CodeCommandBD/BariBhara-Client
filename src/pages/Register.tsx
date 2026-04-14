import { Link } from "react-router-dom";

const Register = () => {
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
        <div className="w-full lg:w-1/2 bg-surface-container-low flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-3">
              <h2 className="font-headline text-4xl font-bold text-on-surface">অ্যাকাউন্ট তৈরি করুন</h2>
              <p className="text-on-surface-variant font-medium">Bari Bhara এ নতুন? শুরু করতে নিচের তথ্যগুলো পূরণ করুন।</p>
            </div>
            
            <form className="space-y-6">
              {/* User Role Switcher - Premium Black & White Gradient Style */}
              <div className="p-1.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex border border-gray-300/50 shadow-inner overflow-hidden">
                <label className="flex-1 cursor-pointer">
                  <input defaultChecked className="sr-only peer" name="role" type="radio" value="tenant" />
                  <div className="py-3.5 text-center rounded-xl font-bold transition-all duration-300 
                    peer-checked:bg-gradient-to-r peer-checked:from-gray-900 peer-checked:to-gray-800 
                    peer-checked:text-white peer-checked:shadow-xl 
                    text-gray-500 hover:text-gray-800">
                    ভাড়াটিয়া (Tenant)
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input className="sr-only peer" name="role" type="radio" value="landlord" />
                  <div className="py-3.5 text-center rounded-xl font-bold transition-all duration-300 
                    peer-checked:bg-gradient-to-r peer-checked:from-gray-900 peer-checked:to-gray-800 
                    peer-checked:text-white peer-checked:shadow-xl 
                    text-gray-500 hover:text-gray-800">
                    বাড়িওয়ালা (Landlord)
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">আপনার নাম</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                    <input 
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 shadow-sm" 
                        placeholder="পুরো নাম লিখুন" 
                        type="text" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">ইমেইল</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                      <input 
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm" 
                        placeholder="example@mail.com" 
                        type="email" 
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">ফোন নম্বর</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">phone_iphone</span>
                      <input 
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm" 
                        placeholder="01XXX-XXXXXX" 
                        type="tel" 
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">পাসওয়ার্ড</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                    <input 
                        className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm" 
                        placeholder="••••••••" 
                        type="password" 
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer">visibility</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-[#F8FAFC] rounded-xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                অ্যাকাউন্ট তৈরি করুন
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container-high"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-on-surface-variant font-medium">অথবা সোশ্যাল মিডিয়া ব্যবহার করুন</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low rounded-xl font-semibold hover:bg-surface-container-high transition-colors active:scale-95">
                <img 
                    alt="Google Logo" 
                    className="w-6 h-6" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDL7cI2ExAGoA7ZxsfnIpuFzEVQxDbqZK3U-QTo2F5r3p_INaIgWsV3FyJSXKaNwLQgLw7NwwIypm8UhUWlZltqkdwzozuGOEiDvCJt8RLBll2KLeGMnOJwulz8rPJmOhLVuy8JNepTzAFpsSgqxA33c89tLclUhhz7Uef6zTiDNP17yuFtc3_pP11bs9tp_5Z2HBw_raCRqgUknESUScVjNDyNkY0tlVz9L_sqcjnw-ZaFRen2fKhQDJlEsiq-1mEP3UbwRAIITCF" 
                />
                <span className="font-headline">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low rounded-xl font-semibold hover:bg-surface-container-high transition-colors active:scale-95">
                <img 
                    alt="Facebook Logo" 
                    className="w-6 h-6" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG0rcoCIfmV0Mjv54TVLxqh6jGerOp_3yQ7wFcBFbYZarqIVwZOwj93RGfrZ0b8R16TwPjnf_MaVfFOFA4sDNLGcfk4p31Jrc6j9wwjAtrgct7q9MNbJl87DSmYmzWRnsOy10tLMAt39k3vHdGzSHruPCokDkEr4R0_Q4we7SasEzBPQovpx0riKOIMq9al4yoxSk9B7DgZre_-ojXhzXJHGVLdTWgdt_2FRaXxRaNrHJ-DFoYvpHwfCB10g49mQz84Qo-7rf4ueCv" 
                />
                <span className="font-headline">Facebook</span>
              </button>
            </div>

            <p className="text-center text-on-surface-variant font-headline">
              ইতিমধ্যেই অ্যাকাউন্ট আছে? <Link className="text-primary font-bold hover:underline" to="/login">লগইন করুন</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
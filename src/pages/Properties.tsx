import { Building2, MapPin, MoreVertical, Plus } from "lucide-react";

import { useProperty } from "../Hook/useProperty"; // আমাদের বানানো প্রপার্টি হুক

import { useUIStore } from "../store/useUIStore"; // মডাল ওপেন করার জন্য স্টোর

const Properties = () => {
  // ২. হুক থেকে প্রপার্টি লিস্ট এবং লোডিং স্টেট নিয়ে আসা
  const { properties, isPropertiesLoading } = useProperty(); // প্রপার্টি লিস্ট এবং লোডিং স্টেট

  // ৩. মডাল ওপেন করার জন্য ফাংশন
  const { openAddPropertyModal } = useUIStore();

  // ৪. যদি ডাটা লোড হতে থাকে, তবে একটি টেক্সট দেখানো (এটি চাইলে স্কেলিটন দিয়ে সুন্দর করা যায়)
  if (isPropertiesLoading)
    return (
      <div className="p-10 text-center font-bold">
        আপনার প্রপার্টি লোড হচ্ছে...
      </div>
    );

  return (
    <div className="space-y-8 p-6">
      {/* ৪. হেডার সেকশন: এখানে পেজের টাইটেল এবং "নতুন যোগ করুন" বাটন থাকে */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-headline">
            আপনার প্রপার্টিসমূহ
          </h1>
          <p className="text-slate-500 text-sm">
            আপনার মালিকানাধীন সব বিল্ডিং এবং হাউজিং প্রকল্পের তালিকা
          </p>
        </div>

        {/* এই বাটনটি ক্লিক করলে নতুন বাড়ি যোগ করার মডালটি খুলবে */}
        <button
          onClick={openAddPropertyModal}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> নতুন বিল্ডিং যোগ করুন
        </button>
      </div>
      {/* ৫. গ্রিড লেআউট: যেখানে সব প্রপার্টি কার্ডগুলো পাশাপাশি সাজানো থাকবে */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* ডাটাবেস থেকে আসা প্রতিটি প্রপার্টির জন্য একটি কার্ড তৈরি করা */}
        {properties?.map((property: any) => (
          <div
            key={property._id}
            className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            {/* ছবির সেকশন: গ্রুপের কার্ডের ভেতর ছবিটিকে সুন্দরভাবে পজিশন করা */}
            <div className="relative h-56 overflow-hidden">
              <img
                // যদি প্রপার্টির ছবি থাকে তবে সেটি দেখাবে, নাহলে একটি ডামি ইমেজ দেখাবে
                src={
                  property.images && property.images.length > 0
                    ? `http://localhost:4000/${property.images[0]}` // আপনার সার্ভার পাথ অনুযায়ী
                    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                }
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* ছবির ওপর একটি হালকা কালো শেড দেওয়া যাতে টেক্সট পড়তে সুবিধা হয় */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* কার্ডের ওপরের ছোট মেনু বাটন (অপশনাল কাজের জন্য) */}
              <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
            {/* ৬. বিস্তারিত সেকশন: বিল্ডিংয়ের নাম এবং ঠিকানা */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {property.name}
                </h3>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <MapPin size={14} /> {property.location}
                </p>
              </div>
              {/* কার্ডের নিচের অংশ: তলা সংখ্যা এবং ডিটেইলস বাটন */}
              <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2.5 bg-slate-100 rounded-xl">
                    <Building2 size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">
                      স্ট্রাকচার
                    </p>
                    <p className="text-xs font-bold">
                      {property.totalFloors} তলা বিল্ডিং
                    </p>
                  </div>
                </div>
                {/* এই বাটনে ক্লিক করলে ভবিষ্যতে বিল্ডিংয়ের ভেতরের সব রুম (Units) দেখা যাবে */}
                <button className="px-4 py-2 bg-slate-50 text-primary text-xs font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                  ডিটেইলস দেখুন
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
       {/* যদি কোনো প্রপার্টি না থাকে তবে একটি খালি মেসেজ দেখানো */}
       {properties?.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
           <p className="text-slate-500 font-bold">আপনার কোনো বিল্ডিং এখনো যুক্ত করা হয়নি!</p>
        </div>
       )}
    </div>
  );
};

export default Properties;

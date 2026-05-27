import { Link } from "react-router-dom";

const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-white w-full pt-20 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <span className="text-xl font-bold text-white font-headline">Bari Bhara</span>
          <p className="text-slate-400 font-body text-sm leading-relaxed">বাংলাদেশের প্রথম কমপ্লিট ডিজিটাল এস্টেট ম্যানেজমেন্ট সলিউশন। সহজ, নিরাপদ এবং আধুনিক।</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">social_leaderboard</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">link</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">কুইক লিঙ্ক</h4>
          <ul className="space-y-4">
            <li><a className="text-slate-400 hover:text-violet-300 transition-colors text-sm" href="#">About Us</a></li>
            <li><a className="text-slate-400 hover:text-violet-300 transition-colors text-sm" href="#">Services</a></li>
            <li><a className="text-slate-400 hover:text-violet-300 transition-colors text-sm" href="#">Career</a></li>
            <li><a className="text-slate-400 hover:text-violet-300 transition-colors text-sm" href="#">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">সাপোর্ট</h4>
          <ul className="space-y-4">
            <li><a className="text-slate-400 hover:text-violet-300 transition-colors text-sm" href="#">FAQ</a></li>
            <li><a className="text-slate-400 hover:text-violet-300 transition-colors text-sm" href="#">Support Center</a></li>
            <li><Link className="text-slate-400 hover:text-violet-300 transition-colors text-sm" to="/terms-privacy">Terms of Service</Link></li>
            <li><Link className="text-slate-400 hover:text-violet-300 transition-colors text-sm" to="/terms-privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">যোগাযোগ</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="material-symbols-outlined text-violet-400">call</span> +৮৮০ ১২৩৪ ৫৬৭৮৯০
            </li>
            <li className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="material-symbols-outlined text-violet-400">mail</span> info@baribhara.com
            </li>
            <li className="flex items-center gap-3 text-slate-400 text-sm">
              <span className="material-symbols-outlined text-violet-400">location_on</span> বনানী, ঢাকা ১২১৩, বাংলাদেশ
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 pt-20 mt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-xs">© 2024 Bari Bhara. Digital Estate Management.</p>
        <div className="flex gap-8">
          <Link className="text-slate-400 hover:text-white text-xs transition-colors" to="/terms-privacy">প্রাইভেসি পলিসি</Link>
          <Link className="text-slate-400 hover:text-white text-xs transition-colors" to="/terms-privacy">শর্তাবলী</Link>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

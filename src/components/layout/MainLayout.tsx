import { Outlet } from "react-router-dom"; // এটি মাঝখানের পেজগুলোকে দেখাবে
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* বাম পাশের সাইডবার */}
      <Sidebar />

      {/* ডান পাশের মূল অংশ */}
      <div className="ml-72 flex flex-col min-h-screen">
        {/* উপরের টপবার */}
        <Topbar />

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-1 pt-24 px-10 pb-12">
          {/* এখানে আমাদের ড্যাশবোর্ড বা অন্যান্য পেজ দেখাবে */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

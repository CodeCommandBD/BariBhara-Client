import { useRouteError, Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
}

const ErrorPage = () => {
    const error = useRouteError() as RouteError;
    console.error(error);

  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-4 font-sans">
      {/* Background abstract shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="relative max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Icon/Visual Area */}
        <div className="flex justify-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-gray-200/50 flex items-center justify-center border border-gray-100 mb-2">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-gray-800 to-gray-400">
            {error.status || "Error"}
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
             {error.status === 404 ? "Page Not Found" : "Something went wrong"}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-[320px] mx-auto">
            {error.statusText || error.message || "An unexpected error occurred. Please try again later."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link 
            to="/" 
            className={cn(
              buttonVariants({ size: "lg" }), 
              "w-full sm:w-auto px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            )}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 rounded-full border-gray-200 hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh Page
          </Button>
        </div>

        <div className="pt-12 text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} BariBhara. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
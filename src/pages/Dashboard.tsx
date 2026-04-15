import { useAuthStore } from "@/store/useAuthStore"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"

const Dashboard = () => {
    const { user, token, logout } = useAuthStore()
    const navigate = useNavigate()

    const logOutMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.get('http://localhost:4000/logout', {
                headers: {
                    Authorization: token
                }
            })
            return response.data
        },
        onSuccess: (data) => {
            logout()
            toast.success(data.message || "লগ-আউট সফল হয়েছে!")
            navigate('/login')
        },
        onError: (error: any) => {
            console.error("Logout error:", error);
            logout()
            navigate('/login')
        }
    })

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-surface p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-center border border-outline/10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold font-headline text-on-surface">
                        স্বাগতম, <br />
                        <span className="text-primary">{user?.fullName || "ব্যবহারকারী"}!</span> 👋
                    </h1>
                    <p className="text-on-surface-variant italic font-medium">
                        {user?.email}
                    </p>
                </div>

                <div className="py-4 px-6 bg-surface-container rounded-xl inline-block">
                    <span className="text-sm font-bold tracking-widest uppercase text-primary">
                        রোল: {user?.role}
                    </span>
                </div>

                <div className="pt-6">
                    <button 
                        onClick={() => logOutMutation.mutate()} 
                        disabled={logOutMutation.isPending}
                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-200"
                    >
                        {logOutMutation.isPending ? "লগ-আউট হচ্ছে..." : "Logout (লগ-আউট)"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
import { useAuthStore } from "@/store/useAuthStore"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import axios from "axios"
import {useMutation} from "@tanstack/react-query"


const Dashboard = () => {

  const {user, token, logout} = useAuthStore()
  const navigate = useNavigate()

  const logOutMutation = useMutation({
    mutationFn: async () =>{
      const response = await axios.get('http://localhost:4000/logout', {
        headers:{
          Authorization: token
        }
      })
      return response.data
    },
    onSuccess: (data)=>{
      logout()
      toast.success(data.message || "লগ-আউট সফল!")
      navigate('/login')
    },
    onError: (error)=>{
      toast.error(error.message || "লগ-আউট ব্যর্থ!")
      logout()
      navigate('/login')
    }
  })

  return (
    <div>
      <h1>ড্যাশবোর্ড</h1>
      <p>স্বাগতম, {user?.name}</p>
      <button 
      disabled={logOutMutation.isPending}
      onClick={() => logOutMutation.mutate()}>
        {logOutMutation.isPending ? 'লগ-আউট হচ্ছে...' : 'লগ-আউট'}
      </button>
    </div>
  )
}

export default Dashboard
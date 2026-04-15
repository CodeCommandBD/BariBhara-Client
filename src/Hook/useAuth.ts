import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore'; // Fixed path from @/ to relative

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("http://localhost:4000/api/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Save both user and token to global state
      setAuth(data.user, data.token);
      toast.success("Account created successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed!";
      toast.error(message);
    },
  });

  const logingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('http://localhost:4000/api/auth/login', data)
      return response.data
    },
    onSuccess(data){
      setAuth(data.user, data.token)
      toast.success("Login successfully!")
    },
    onError(error: any){
      const message = error.response?.data?.message || "Login failed!"
      toast.error(message)
    }
  })

  return {
    registerUser: registerMutation.mutate,
    loginUser: logingMutation.mutate,
    isLoading: registerMutation.isPending || logingMutation.isPending,
    error: registerMutation.error || logingMutation.error,
    isSuccess: registerMutation.isSuccess || logingMutation.isSuccess
  };
};

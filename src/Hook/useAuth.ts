import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore'; // Fixed path from @/ to relative
import { useNavigate } from 'react-router';

const API_URL = "http://localhost:4000/api/auth";

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Save both user and token to global state
      setAuth(data.user, data.token);
      toast.success("Account created successfully!");
      navigate("/login")
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed!";
      toast.error(message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`${API_URL}/login`, data)
      return response.data
    },
    onSuccess(data){
      setAuth(data.user, data.token)
      toast.success("Login successfully!")
      navigate("/dashboard")
    },
    onError(error: any){
      const message = error.response?.data?.message || "Login failed!"
      toast.error(message)
    }
  })

  return {
    registerUser: registerMutation.mutate,
    loginUser: loginMutation.mutate,
    isLoading: registerMutation.isPending || loginMutation.isPending,
    error: registerMutation.error || loginMutation.error,
    isSuccess: registerMutation.isSuccess || loginMutation.isSuccess
  };
};

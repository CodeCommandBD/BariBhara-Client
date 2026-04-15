import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
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
    },
    onError: (error) => {
      console.error("Registration Error:", error);
    },
  });

  return {
    registerUser: registerMutation.mutate,
    isLoading: registerMutation.isPending,
    error: registerMutation.error,
    isSuccess: registerMutation.isSuccess
  };
};
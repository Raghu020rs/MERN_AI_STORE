import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the page user was trying to access
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      // Redirect to the page they were trying to access or home
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleSwitchMode = () => {
    navigate('/register');
  };

  return <AuthForm mode="signin" onSubmit={handleSubmit} onSwitchMode={handleSwitchMode} />;
}

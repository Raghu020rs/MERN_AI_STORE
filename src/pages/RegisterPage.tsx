import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (data: any) => {
    // Validation
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register(data.name, data.email, data.password, data.confirmPassword);
      toast.success('Account created successfully!');
      // Redirect to home page after successful registration
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleSwitchMode = () => {
    navigate('/login');
  };

  return <AuthForm mode="signup" onSubmit={handleSubmit} onSwitchMode={handleSwitchMode} />;
}

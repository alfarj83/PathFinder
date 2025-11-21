import LoginForm from '@/components/auth/LoginForm';
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const router = useRouter();

    function Success() {
        console.log('Login was a success! Please verify your email.')
        router.push('/')
    }

  return (<LoginForm onLoginSuccess={Success}/>);
}
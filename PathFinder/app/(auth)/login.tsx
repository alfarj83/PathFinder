import LoginForm from '@/components/auth/LoginForm';
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const router = useRouter();

    function Success() {
        console.log('login was a success!!')
        router.push('/')
    }

  return (<LoginForm onLoginSuccess={Success}/>);
}
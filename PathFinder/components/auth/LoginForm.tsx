import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { UserObj } from '@/services/user';
import { useRouter } from 'expo-router';
// Removed useRouter as navigation is now handled by the parent component

// Define props to accept the success callback
interface LoginFormProps {
  onLoginSuccess: () => void; 
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    // Assuming UserObj.logIn returns { success: boolean, message?: string }
    const response = await UserObj.logIn(email, password);
    setLoading(false);

    if (response.success) {
      // 1. Call the success callback to tell the parent component to navigate to home
      onLoginSuccess(); 
    } else {
      Alert.alert('Error', response.message || 'Failed to log in');
    }
  };

  // navigate to sign up
  function navigateToSignUp() {
    router.push('/(auth)/signup');
  }

  return (
    <View style={styles.formContainer}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/pathfinder_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Log In</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A8B5A9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!loading}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A8B5A9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          editable={!loading}
        />

        {/* Sign In Button */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <View style={styles.signUpText}>
          <Text style={{ fontSize: 20 }}>{'New Guest? '}</Text>
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={{ fontSize: 20, textDecorationLine: 'underline', fontWeight: 'bold'}}>{'Sign Up Here'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    // This container now acts as the visual card background
    backgroundColor: '#E8E5D8',
    borderRadius: 15,
    paddingHorizontal: 20, 
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    height: '100%',
    width: '100%',// Reduced inner padding
    //backgroundColor: 'red',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200, 
    height: 200,
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40, 
    color: '#000',
  },
  input: {
    width: '100%',
    backgroundColor: '#6B7B6E',
    borderRadius: 8,
    padding: 30,
    marginBottom: 15,
    color: '#FFF',
    fontSize: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#999',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  signUpText: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
    justifyContent: 'center',
  }
});
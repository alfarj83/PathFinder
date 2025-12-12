/**
 * LoginForm Component
 * 
 * A reusable authentication form that handles user login functionality.
 * Provides email/password input fields, form validation, and navigation to sign-up.
 * 
 * @component
 * @param {LoginFormProps} props - Component props
 * @param {Function} props.onLoginSuccess - Callback executed after successful login
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserObj } from '@/services/user';
import { useRouter } from 'expo-router';

// Define component props interface
interface LoginFormProps {
  onLoginSuccess: () => void; 
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  // State management for form inputs and loading status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  // Handles the login process
  // Validates inputs, calls authentication service, and handles response
  const handleLogIn = async () => {
    // Validate input fields are filled
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Set loading state and attempt login
    setLoading(true);
    const response = await UserObj.logIn(email, password);
    setLoading(false);

    // Set login response handling
    if (response.success) {
      onLoginSuccess(); 
    } else {
      Alert.alert('Error', response.message || 'Failed to log in');
    }
  };

  // Navigate to sign-up screen for user
  function navigateToSignUp() {
    router.push('/(auth)/signup');
  }

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
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
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#A8B5A9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
            editable={!loading}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#A8B5A9" 
            />
          </TouchableOpacity>
        </View>

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
    </ScrollView>
  );
};

// Component Styles
// Defines the visual appearance and layout of the login form
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
    width: '100%',
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
    borderRadius: 25,
    padding: 25,
    marginBottom: 15,
    color: '#FFF',
    fontSize: 19,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    width: '100%',
    backgroundColor: '#6B7B6E',
    borderRadius: 25,
    padding: 25,
    paddingRight: 60,
    color: '#FFF',
    fontSize: 19,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -18 }],
    padding: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 40,
    padding: 20,
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#999',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 19,
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
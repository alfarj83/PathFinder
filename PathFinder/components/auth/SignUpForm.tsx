// components/auth/SignUpForm.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image  // ADD THIS IMPORT
} from 'react-native';
import { UserObj } from '@/services/user';
import { useRouter } from 'expo-router';

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const response = await UserObj.signUp(email, password);
    setLoading(false);

    if (response.success) {
      Alert.alert(
        'Success', 
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login')
          }
        ]
      );
    } else {
      Alert.alert('Error', response.message || 'Failed to create account');
    }
  };

  const navigateToLogIn = () => {
    router.push('/login');
  };

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
        <Text style={styles.title}>Create Your Account</Text>

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
        />
        {loading && <Text>
            {'An confirmation email has been sent to your inbox.'}
          </Text>}
        {/* Sign Up Button */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Log In Link */}
        <View style={styles.footer}>
          <Text style={{fontSize: 20 }}>Have An Account? </Text>
          <TouchableOpacity onPress={navigateToLogIn}>
            <Text style={{ fontSize: 20, textDecorationLine: 'underline', fontWeight: 'bold'}}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
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
    width: '100%'
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
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 20,
    color: '#000',
  },
  link: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#000',
  },
});
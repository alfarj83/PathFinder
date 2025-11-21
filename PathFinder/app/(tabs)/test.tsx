// import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { useState } from 'react';
// import LoginForm from '@/components/auth/LoginForm';
// import SignUpForm from '@/components/auth/SignUpForm';
  
// export default function TestScreen() {
//   console.log('TEST SCREEN LOADED - NEW VERSION');
//   const [showLogin, setShowLogin] = useState(true);

//   return (
//     <View style={styles.container}>
//       {/* Toggle buttons */}
//       <View style={styles.toggleContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, showLogin && styles.activeButton]}
//           onPress={() => setShowLogin(true)}
//         >
//           <Text style={[styles.toggleText, showLogin && styles.activeText]}>
//             Login
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showLogin && styles.activeButton]}
//           onPress={() => setShowLogin(false)}
//         >
//           <Text style={[styles.toggleText, !showLogin && styles.activeText]}>
//             Sign Up
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Show form based on toggle */}
//       <ScrollView style={styles.formContainer}>
//         {showLogin ? <LoginForm /> : <SignUpForm />}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     padding: 20,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   toggleButton: {
//     flex: 1,
//     padding: 15,
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     marginHorizontal: 5,
//     borderRadius: 8,
//   },
//   activeButton: {
//     backgroundColor: '#6B8E7F',
//   },
//   toggleText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#666',
//   },
//   activeText: {
//     color: '#fff',
//   },
//   formContainer: {
//     flex: 1,
//   },
// });

// app/(tabs)/test.tsx
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ProfessorProfile from '@/components/ProfessorProfile';

export default function TestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get professorId from route params
  const professorId = params.professorId as string;

  const handleBackPress = () => {
    router.back();
  };

  // Show professor profile if professorId exists
  if (professorId) {
    return (
      <View style={styles.container}>
        <ProfessorProfile professorId={professorId} />
      </View>
    );
  }

  // Otherwise show error
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>No professor selected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    backgroundColor: '#627768',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});
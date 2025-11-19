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
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import SignUpForm from '@/components/auth/SignUpForm';
import LoginForm from '@/components/auth/LoginForm';
import HomeScreen from '@/components/HomeScreen';

export default function TestScreen() {
    return (
      <HomeScreen/>
    );
  // return (
  //   <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
  //     {/* Header Labels */}
  //     <View style={styles.headerRow}>
  //       <Text style={styles.headerLabel}>Sign In Page</Text>
  //       <Text style={styles.headerLabel}>Log In Page</Text>
  //     </View>

  //     {/* Side by Side Forms */}
  //     <View style={styles.formsRow}>
  //       <View style={styles.formWrapper}>
  //         <SignUpForm />
  //       </View>
  //       <View style={styles.formWrapper}>
  //         <LoginForm onLoginSuccess={Success}/>
  //       </View>
  //     </View>
  //   </ScrollView>/
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#666',
  },
  formsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  formWrapper: {
    flex: 1,
    minHeight: 600, // Ensure full height
  },
});
// app/(tabs)/test.tsx
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ProfessorProfile from '@/components/ProfessorProfile';
import HomeScreen from '@/components/HomeScreen';

// profile page
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
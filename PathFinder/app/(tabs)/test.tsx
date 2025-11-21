// app/(tabs)/test.tsx
import CourseProfile from '@/components/CourseProfile';
import ProfessorProfile from '@/components/ProfessorProfile';
import HomeScreen from '@/components/HomeScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

// Profile page - handles both professor and course profiles
export default function TestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get professorId from route params
  const professorId = params.professorId as string;
  const courseId = params.courseId as string;

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
  } else if (courseId) {
    return (
      <View style={styles.container}>
        <CourseProfile courseId={courseId} />
      </View>
    );
  }

  // Show course profile if courseId exists
  if (courseId) {
    return (
      <View style={styles.container}>
        <CourseProfile courseId={courseId}/>
      </View>
    )
  }

  //If neither Ids are present return null
  return null;
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
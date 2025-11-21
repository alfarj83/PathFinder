import { Course, Professor } from '@/types';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

type CourseProfileProps = {
  courseId?: string;
};

type ProfessorCardProps = {
  professor: Professor;
  onPress: () => void;
};

/**
 * Renders a professor card
 */
const ProfessorCard = ({ professor, onPress }: ProfessorCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#4CAF50';
    if (rating >= 3) return '#FFA726';
    return '#EF5350';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return '#4CAF50';
    if (difficulty <= 3.5) return '#FFA726';
    return '#EF5350';
  };

  return (
    <TouchableOpacity style={styles.professorCard} onPress={onPress}>
      <View style={styles.professorCardContent}>
        {/* Professor Image - using icon as placeholder */}
        <View style={styles.professorImageContainer}>
          <Ionicons name="person-circle-outline" size={50} color="#666" />
        </View>
        
        {/* Professor Info */}
        <View style={styles.professorInfo}>
          <Text style={styles.professorName}>{professor.full_name}</Text>
          <View style={styles.departmentRow}>
            <Ionicons name="briefcase-outline" size={14} color="#666" />
            <Text style={styles.departmentText}>{professor.department_name}</Text>
          </View>
        </View>

        {/* Ratings Container */}
        <View style={styles.ratingsContainer}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingLabel}>Rating</Text>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(professor.rating) }]}>
              <Text style={styles.ratingValue}>{professor.rating}/5</Text>
            </View>
          </View>
          
          <View style={styles.ratingBox}>
            <Text style={styles.ratingLabel}>Difficulty</Text>
            <View style={[styles.ratingBadge, { backgroundColor: getDifficultyColor(professor.diff) }]}>
              <Text style={styles.ratingValue}>{professor.diff}/5</Text>
            </View>
          </View>

          <Text style={styles.ratingsCount}>+{professor.num_ratings}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CourseProfile({ courseId }: CourseProfileProps = {}) {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [currentProfessors, setCurrentProfessors] = useState<Professor[]>([]);
  const [pastProfessors, setPastProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPrerequisites, setHasPrerequisites] = useState(false);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get course ID from props first, then fall back to route params
  const activeCourseId = courseId || (params.courseId as string);

  const handleBackPress = () => {
    // Check if we came from a search and have the search params
    if (params.fromSearch === 'true' && params.searchResults) {
      router.push({
        pathname: '/courses',
        params: {
          searchQuery: params.searchQuery,
          searchResults: params.searchResults
        }
      });
    } else {
      // Otherwise just go back
      router.back();
    }
  };

  useEffect(() => {
    if (activeCourseId) {
      fetchCourseData();
    } else {
      setError('No course ID provided');
      setLoading(false);
    }
  }, [activeCourseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: courseError } = await supabase
        .from('courses')
        .select('id, course_code, course_name, course_desc')
        .eq('id', activeCourseId)
        .single();

      if (courseError) {
        throw courseError;
      }

      if (!data) {
        throw new Error('Course not found');
      }

      // Ensure rating and difficulty are numbers
      const processedData = {
        ...data,
      };

      setCourseData(processedData);
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to load course data');
      Alert.alert('Error', 'Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessorsForCourse = async () => {
    try {
      // This is a placeholder implementation
      const { data: profs, error: profsError } = await supabase
        .from('professors')
        .select('*')
        .limit(5);

      if (profs && profs.length > 0) {
        // Split professors into current and past (this is mock logic)
        setCurrentProfessors(profs.slice(0, 1)); // First professor as current
        setPastProfessors(profs.slice(1, 3)); // Next two as past
      }
    } catch (err) {
      console.error('Error fetching professors for course:', err);
    }
  };

  const navigateToProfessorProfile = (professorId: string) => {
    router.push({
      pathname: '/test',
      params: { 
        professorId,
        fromCourse: 'true',
        courseId: activeCourseId
      }
    });
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#627768" />
          <Text style={styles.loadingText}>Loading course...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Error state
  if (error || !courseData) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color="#E74C3C" />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>
            {error || 'Unable to load course data'}
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.courseCode}>{courseData.course_code}</Text>
            <Text style={styles.courseName}>{courseData.course_name}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Course Description Card */}
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Course Description</Text>
            <Text style={styles.descriptionText}>
              {courseData.course_desc || 'No description available.'}
            </Text>
            
            {/* Prerequisites Button */}
            {!hasPrerequisites && (
              <TouchableOpacity style={styles.prerequisitesButton}>
                <Text style={styles.prerequisitesText}>No Prerequisites</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Current Professors Section */}
          <View style={styles.professorsSection}>
            <Text style={styles.sectionHeader}>Current Professors</Text>
            {currentProfessors.length > 0 ? (
              currentProfessors.map((professor) => (
                <ProfessorCard
                  key={professor.id}
                  professor={professor}
                  onPress={() => navigateToProfessorProfile(professor.id)}
                />
              ))
            ) : (
              <View style={styles.noProfessorsCard}>
                <Text style={styles.noProfessorsText}>No current professors listed</Text>
              </View>
            )}
          </View>

          {/* Past Professors Section */}
          <View style={styles.professorsSection}>
            <Text style={styles.sectionHeader}>Past Professors</Text>
            {pastProfessors.length > 0 ? (
              pastProfessors.map((professor) => (
                <ProfessorCard
                  key={professor.id}
                  professor={professor}
                  onPress={() => navigateToProfessorProfile(professor.id)}
                />
              ))
            ) : (
              <View style={styles.noProfessorsCard}>
                <Text style={styles.noProfessorsText}>No past professors listed</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#E8E4D5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  descriptionCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  prerequisitesButton: {
    backgroundColor: '#D87A5D',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  prerequisitesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  professorsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  professorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  professorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professorImageContainer: {
    marginRight: 12,
  },
  professorInfo: {
    flex: 1,
  },
  professorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  departmentText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBox: {
    marginRight: 10,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  noProfessorsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  noProfessorsText: {
    fontSize: 14,
    color: '#999',
  },
});
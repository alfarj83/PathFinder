import { Ionicons } from '@expo/vector-icons';
//import { useRouter } from 'expo-router';
import { useRouter, useLocalSearchParams } from 'expo-router'; // 1. Import useLocalSearchParams
import { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Button,
    Alert
} from 'react-native';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';
import { Professor, Course } from '@/types';
import { UserObj } from '@/services/user';

export default function CoursesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // 2. Get all navigation parameters
  const { searchResults } = params; // 3. Get your specific 'searchResults' param
  const [selectedDepartment, setSelectedDepartment] = useState('Communication & Media Department');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseCode, setCourseCode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  // Only re-run when relevant navigation params change. Using the whole
  // `params` object can cause a new reference every render and trigger
  // an infinite update loop. Depend on specific fields instead.
  useEffect(() => {
    console.debug('[faculty] effect run - params:', {
      searchResults: params?.searchResults,
      searchQuery: params?.searchQuery,
    });
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.searchResults, params?.searchQuery]);


  async function loadCourses() {
    setLoading(true);
    try {
      // Check if we have search results passed from the search screen
      if (params?.searchResults) {
        // Parse the search results from the URL parameter
        const results = JSON.parse(Array.isArray(params.searchResults) ? params.searchResults[0] : params.searchResults);
        console.log(results)
        setCourses(results);
        setSearchQuery(Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery || null);
        // Update header to show it's a search result
        setSelectedDepartment(`Search Results for "${Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery}"`);
      } 

      console.log('here is the course info', courses)

    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  }

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

    // Updated to accept professor ID and pass current search context
  const navigateToProfile = (courseId: string|number) => {
    router.push({
      pathname: '/test',
      params: { 
        courseId,
        // Pass back the current search context so we can return to it
        fromSearch: 'true',
        searchQuery: params.searchQuery || '',
        searchResults: params.searchResults || ''
      }
    });
  };

  function handleSaved(courseId: string | number) {
    Alert.alert('Course saved!')
    UserObj.saveCourse(courseId);
  }
  

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedDepartment}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B8E7F" />
        </View>
      ) : courses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Courses found</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {courses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.professorCard} onPress={() => navigateToProfile(course.id)}>
              <View style={styles.cardContent}>
                {/* Professor Image */}
                <View style={styles.imageContainer}>
                  <Ionicons name="person-circle-outline" size={50} color="#666" />
                </View>

                {/* Professor Info */}
                <View style={styles.professorInfo}>
                  <Text style={styles.professorName}>{course.course_name}</Text>
                  <View style={styles.departmentRow}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.departmentText}>{course.course_code}</Text>
                  </View>
                </View>
                <Button title="Save" onPress={() => handleSaved(course.id)}></Button>
                </View>
              </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6B8E7F',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  content: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
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
  ratingValue: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  plusRatings: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
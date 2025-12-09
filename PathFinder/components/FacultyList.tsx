import { Course, Professor } from '@/types';
import {
  formatRating,
  getDifficultyColor,
  getRatingColor,
  toNumber,
} from '@/utils/formatters';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function ProfsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // 2. Get all navigation parameters
  const { searchResults } = params; // 3. Get your specific 'searchResults' param
  const [selectedDepartment, setSelectedDepartment] = useState('Communication & Media Department');
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  useEffect(() => {
    console.debug('[faculty] effect run - params:', {
      searchResults: params?.searchResults,
      departmentCode: params?.departmentCode,
      searchQuery: params?.searchQuery,
      departmentName: params?.departmentName,
    });
    loadProfessors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.searchResults, params?.departmentCode, params?.searchQuery, params?.departmentName]);

  async function loadProfessors() {
    setLoading(true);
    try {
      // Check if we have search results passed from the search screen
      if (params?.searchResults) {
        // Parse the search results from the URL parameter
        const results = JSON.parse(Array.isArray(params.searchResults) ? params.searchResults[0] : params.searchResults);
        setProfessors(results);
        setSearchQuery(Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery || null);
        
        // Update header to show it's a search result
        setSelectedDepartment(`Search Results for "${Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery}"`);
      } 
      // Check if we have a department to display
      else if (params?.departmentCode) {
        setSelectedDepartment(Array.isArray(params.departmentName) ? params.departmentName[0] : params.departmentName || 'Faculty');
        
        // Load professors from the specific department
        const { data } = await supabase
          .from('professors')
          .select()
          .eq('department_code', Array.isArray(params.departmentCode) ? params.departmentCode[0] : params.departmentCode);
        if (data) setProfessors(data);
      } 
      // Default: Load all professors
      else {
        const { data } = await supabase.from('professors').select();
        if (data) setProfessors(data);
      }
    } catch (error) {
      console.error('Error loading professors:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCourses() {
    setLoading(true);
    try {
      // Check if we have search results passed from the search screen
      if (params?.searchResults) {
        // Parse the search results from the URL parameter
        const results = JSON.parse(Array.isArray(params.searchResults) ? params.searchResults[0] : params.searchResults);
        setCourses(results);
        setSearchQuery(Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery || null);
        // Update header to show it's a search result
        setSelectedDepartment(`Search Results for "${Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery}"`);
        
      } 

      // parse through searchQuery
      // Check if we have a department to display
      else if (params?.departmentCode) {
        setSelectedDepartment(Array.isArray(params.departmentName) ? params.departmentName[0] : params.departmentName || 'Faculty');
        
        // Load professors from the specific department
        const { data } = await supabase
          .from('courses')
          .select()
          .eq('course_code', Array.isArray(params.departmentCode) ? params.departmentCode[0] : params.departmentCode);
        if (data) setProfessors(data);
      } 
      // Default: Load all professors
      else {
        const { data } = await supabase.from('courses').select();
        if (data) setCourses(data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  }

  // Updated to accept professor ID and pass current search context
  const navigateToProfile = (professorId: string) => {
    router.push({
      pathname: '/test',
      params: { 
        professorId,
        // Pass back the current search context so we can return to it
        fromSearch: 'true',
        searchQuery: params.searchQuery || '',
        searchResults: params.searchResults || ''
      }
    });
  };
  

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
      ) : professors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No professors found</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {professors.map((professor) => (
            <TouchableOpacity 
              key={professor.id} 
              style={styles.professorCard} 
              onPress={() => navigateToProfile(professor.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                {/* Professor Image */}
                <View style={styles.imageContainer}>
                  <Ionicons name="person-circle-outline" size={50} color="#666" />
                </View>

                {/* Professor Info */}
                <View style={styles.professorInfo}>
                  <Text style={styles.professorName}>{professor.full_name}</Text>
                  <View style={styles.departmentRow}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.departmentText}>{professor.department_name}</Text>
                  </View>
                </View>

                {/* Ratings */}
                <View style={styles.ratingsContainer}>
                  <View style={styles.ratingBox}>
                    <Text style={styles.ratingLabel}>Rating</Text>
                    <View style={[styles.ratingValue, { backgroundColor: getRatingColor(professor.rating) }]}>
                      <Text style={styles.ratingText}>{formatRating(professor.rating)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.ratingBox}>
                    <Text style={styles.ratingLabel}>Difficulty</Text>
                    <View style={[styles.ratingValue, { backgroundColor: getDifficultyColor(professor.diff ?? professor.difficulty) }]}>
                      <Text style={styles.ratingText}>{formatRating(professor.diff ?? professor.difficulty)}</Text>
                    </View>
                  </View>

                  <Text style={styles.plusRatings}>+{toNumber(professor.num_ratings)}</Text>
                </View>
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
    paddingTop: 80,
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
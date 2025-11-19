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
    ActivityIndicator
} from 'react-native';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';

export default function FacultyScreen() {
    const router = useRouter();
    const params = useLocalSearchParams(); // 2. Get all navigation parameters
    const { searchResults } = params; // 3. Get your specific 'searchResults' param
    const [selectedDepartment, setSelectedDepartment] = useState('Communication & Media Department');
    const [professors, setProfessors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [profName, setProfName] = useState<string>('Barbara Cutler');
    const [profDept, setProfDept] = useState<string>('Computer Science');
    const [rating, setRating] = useState<number>(3.3);
    const [difficulty, setDifficulty] = useState<number>(3);
    const [searchMode, setSearchMode] = useState<boolean>(false)

  // Only re-run when relevant navigation params change. Using the whole
  // `params` object can cause a new reference every render and trigger
  // an infinite update loop. Depend on specific fields instead.
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
        console.log(params.searchResults)
        setSearchMode(true)
        // Parse the search results from the URL parameter
        const results = JSON.parse(Array.isArray(params.searchResults) ? params.searchResults[0] : params.searchResults);
        setProfessors(results);
        setSearchQuery(Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery || null);
        
        // Update header to show it's a search result
        if (searchMode) setSelectedDepartment(`Search Results for "${Array.isArray(params.searchQuery) ? params.searchQuery[0] : params.searchQuery}"`);
        else setSelectedDepartment(`"${Array.isArray(params.searchQuery) ? params.searchQuery[4] : params.searchQuery}"`);
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

  const navigateToProfile = () => {
    router.push('/test'); // Push a new screen onto the stack
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
            <TouchableOpacity key={professor.id} style={styles.professorCard} onPress={navigateToProfile}>
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
                      <Text style={styles.ratingText}>{professor.rating}/5</Text>
                    </View>
                  </View>
                  
                  <View style={styles.ratingBox}>
                    <Text style={styles.ratingLabel}>Difficulty</Text>
                    <View style={[styles.ratingValue, { backgroundColor: getDifficultyColor(professor.difficulty) }]}>
                      <Text style={styles.ratingText}>{professor.difficulty}/5</Text>
                    </View>
                  </View>

                  <Text style={styles.plusRatings}>+{professor.numRatings}</Text>
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
    paddingTop: 10,
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
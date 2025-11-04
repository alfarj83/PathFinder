import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { departmentService } from '@/services/departments';
import { professorService } from '@/services/professors';
import { courseService } from '@/services/courses';
import { Department } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState<'professor' | 'course'>('professor');
  const [searching, setSearching] = useState(false);

  // Load departments on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
      Alert.alert('Error', 'Failed to load departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Search', 'Please enter a search query');
      return;
    }

    try {
      setSearching(true);

      if (searchMode === 'professor') {
        const results = await professorService.searchProfessors(searchQuery);
        
        if (results.length === 0) {
          Alert.alert('No Results', 'No professors found matching your search.');
          return;
        }

        // Navigate to faculty page with search results
        router.push({
          pathname: '/faculty',
          params: { 
            searchQuery,
            searchResults: JSON.stringify(results)
          }
        });
      } else {
        const results = await courseService.searchCourses(searchQuery);
        
        if (results.length === 0) {
          Alert.alert('No Results', 'No courses found matching your search.');
          return;
        }

        // Navigate to courses page with search results
        // Note: You'll need to create this page later
        Alert.alert('Coming Soon', 'Course search will be available soon!');
        // Uncomment when you create the courses page:
        // router.push({
        //   pathname: '/courses',
        //   params: { 
        //     searchQuery,
        //     searchResults: JSON.stringify(results)
        //   }
        // });
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to perform search. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'professor' ? 'course' : 'professor');
    setSearchQuery(''); // Clear search when toggling
  };

  const handleDepartmentPress = (dept: Department) => {
    router.push({
      pathname: '/faculty',
      params: { 
        departmentCode: dept.code,
        departmentName: dept.fullName || dept.name
      }
    });
  };

  const handleViewSaved = () => {
    // Navigate to profile/saved page
    Alert.alert('Coming Soon', 'Saved items will be available soon!');
    // Uncomment when you create the profile page:
    // router.push('/profile');
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Pathfinder</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="compass" size={24} color="white" />
              </View>
            </View>
            <Text style={styles.welcomeText}>Welcome, User!</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={`Search for ${searchMode === 'professor' ? 'Professors' : 'a Course'}`}
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                editable={!searching}
              />
              <TouchableOpacity 
                style={styles.searchButton} 
                onPress={handleSearch}
                disabled={searching}
              >
                {searching ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <Ionicons name="search" size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={toggleSearchMode} activeOpacity={0.7}>
              <Text style={styles.subText}>
                Search for a {searchMode === 'professor' ? 'course' : 'professor'} instead
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.viewSavedButton}
              onPress={handleViewSaved}
              activeOpacity={0.8}
            >
              <Text style={styles.viewSavedText}>View Saved</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Departments Section */}
        <View style={styles.departmentsSection}>
          <Text style={styles.sectionTitle}>EXPLORE DEPARTMENTS</Text>
          <Text style={styles.sectionSubtitle}>
            Humanities, Arts, and Social Sciences
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B8E7F" />
              <Text style={styles.loadingText}>Loading departments...</Text>
            </View>
          ) : (
            <View style={styles.departmentGrid}>
              {departments.map((dept) => (
                <TouchableOpacity 
                  key={dept.id} 
                  style={styles.departmentButton}
                  onPress={() => handleDepartmentPress(dept)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.departmentCode}>{dept.code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  iconCircle: {
    backgroundColor: '#5A7A6B',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8E4D9',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  viewSavedButton: {
    backgroundColor: '#8FA896',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewSavedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  departmentsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  departmentButton: {
    backgroundColor: '#8FA896',
    width: '30%',
    aspectRatio: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  departmentCode: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
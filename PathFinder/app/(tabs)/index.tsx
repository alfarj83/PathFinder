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
import { Ionicons } from '@expo/vector-icons';
import { DeptObj } from '@/services/departments';
import { ProfObj } from '@/services/professors';
import { CourseObj } from '@/services/courses';
import { Department } from '@/types';
import { UserObj } from '@/services/user';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [humanities, setHumanities] = useState<Department[]>([]);
  const [engineering, setEngineering] = useState<Department[]>([]);
  const [architecture, setArchitecture] = useState<Department[]>([]);
  const [management, setManagement] = useState<Department[]>([]);
  const [science, setScience] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState<'professor' | 'course'>('professor');
  const [searching, setSearching] = useState(false);

  //Load departments on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    let hum:Department[] = [], 
      eng:Department[] = [], 
      arch:Department[] = [], 
      manage:Department[] = [], 
      sci:Department[] = [];

    try {
      setLoading(true);
      const data = await DeptObj.getDeptList();
      for (let i = 0; i < data.length; i++) {
        if (data[i].category === 'Humanities, Arts and Social Sciences') {
          hum.push(data[i]);
        } else if (data[i].category === 'Engineering') {
          eng.push(data[i]);
        } else if (data[i].category === 'Architecture') {
          arch.push(data[i]);
        } else if (data[i].category === 'Science') {
          sci.push(data[i]); 
        } else if (data[i].category === 'Management') {
          manage.push(data[i]);
        }
      }
      setHumanities(hum);
      setEngineering(eng);
      setArchitecture(arch);
      setScience(sci);
      setManagement(manage);
    } catch (error) {
      console.error('Error loading departments:', error);
      Alert.alert('Error', 'Failed to load departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    if (searchMode === 'professor') {
      UserObj.displayMatchingProfessors(searchQuery, router);
    } else {
      Alert.alert('Coming Soon', 'Course search will be available soon!');
    }
    setSearching(false);
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
              {humanities.map((dept) => (
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
          <Text style={styles.sectionSubtitle}>
            Engineering
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B8E7F" />
              <Text style={styles.loadingText}>Loading departments...</Text>
            </View>
          ) : (
            <View style={styles.departmentGrid}>
              {engineering.map((dept) => (
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
          <Text style={styles.sectionSubtitle}>
            Architecture
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B8E7F" />
              <Text style={styles.loadingText}>Loading departments...</Text>
            </View>
          ) : (
            <View style={styles.departmentGrid}>
              {architecture.map((dept) => (
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
          <Text style={styles.sectionSubtitle}>
            Management
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B8E7F" />
              <Text style={styles.loadingText}>Loading departments...</Text>
            </View>
          ) : (
            <View style={styles.departmentGrid}>
              {management.map((dept) => (
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
          <Text style={styles.sectionSubtitle}>
            Science
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6B8E7F" />
              <Text style={styles.loadingText}>Loading departments...</Text>
            </View>
          ) : (
            <View style={styles.departmentGrid}>
              {science.map((dept) => (
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
    //flex: 1,
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
    //backgroundColor: 'red',
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
    //backgroundColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  departmentButton: {
    backgroundColor: '#8FA896',
    width: '30%',
    padding: 30,
    aspectRatio: 1.2,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    margin: 5,
  },
  departmentCode: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
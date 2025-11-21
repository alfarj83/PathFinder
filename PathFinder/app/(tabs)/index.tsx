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
import { APIObj } from '@/services/api';
import { Professor } from '@/types';
import HomeScreen from '@/components/HomeScreen';

export default function ProfessorHomeTab() {
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

  // // department data is based on mockDepartments, NOT supabase data
  // function loadDepartments() {
  //   let hum:Department[] = [], 
  //     eng:Department[] = [], 
  //     arch:Department[] = [], 
  //     manage:Department[] = [], 
  //     sci:Department[] = [];

  //   try {
  //     setLoading(true);
  //     const data = DeptObj.getDeptList();
  //     for (let i = 0; i < data.length; i++) {
  //       if (data[i].category === 'Humanities, Arts and Social Sciences') {
  //         hum.push(data[i]);
  //       } else if (data[i].category === 'Engineering') {
  //         eng.push(data[i]);
  //       } else if (data[i].category === 'Architecture') {
  //         arch.push(data[i]);
  //       } else if (data[i].category === 'Science') {
  //         sci.push(data[i]); 
  //       } else if (data[i].category === 'Management') {
  //         manage.push(data[i]);
  //       }
  //     }
  //     setHumanities(hum);
  //     setEngineering(eng);
  //     setArchitecture(arch);
  //     setScience(sci);
  //     setManagement(manage);
  //   } catch (error) {
  //     console.error('Error loading departments:', error);
  //     Alert.alert('Error', 'Failed to load departments. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSearch = async () => {
  //   setSearching(true);
  //   if (searchMode === 'professor') {
  //     UserObj.displayMatchingProfessors(searchQuery, router);
  //   } else {
  //     Alert.alert('Coming Soon', 'Course search will be available soon!');
  //   }
  //   setSearching(false);
  // };

  // const handleDepartmentPress = async (dept: Department) => {
  //   let results = await DeptObj.getDeptProfessors(dept.name);
  //   // Navigate to faculty page with search results
  //   router.push({
  //       pathname: '/faculty',
  //       params: { 
  //           searchQuery,
  //           searchResults: JSON.stringify(results)
  //       }
  //   });
  // };

  // const handleViewSaved = () => {
  //   // Navigate to profile/saved page
  //   Alert.alert('Coming Soon', 'Saved items will be available soon!');
  //   // Uncomment when you create the profile page:
  //   // router.push('/profile');
  // };
  
  return <HomeScreen/>;
}

// ProfileTab Component
//
// User profile screen displaying:
// - User account information (email, department, join date)
// - Preview of saved courses (limited to 2)
// - Preview of saved professors (limited to 2)
// - Pull-to-refresh functionality
// - Sign out capability

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Button
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Professor, Course } from '@/types';
import Icon from 'react-native-vector-icons/Feather';

export default function ProfileTab() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userDepartment, setUserDepartment] = useState('Computer Science');
  const [joinedDate, setJoinedDate] = useState('');
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [savedProfessors, setSavedProfessors] = useState<Professor[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      // Get current user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found');
        return;
      }

      setUserEmail(user.email || '');

      // Format joined date
      const createdAt = new Date(user.created_at);
      const monthYear = createdAt.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      setJoinedDate(`Joined in ${monthYear}`);

      // Load saved courses (limit to 2 for preview)
      const { data: savedCoursesData } = await supabase
        .from('saved_courses')
        .select('courses(*)')
        .eq('user_id', user.id)
        .limit(2);

      if (savedCoursesData) {
        const courses = savedCoursesData
          .map((item: any) => item.courses)
          .filter((course): course is Course => course !== null);
        setSavedCourses(courses);
      }

      // Load saved professors (limit to 2 for preview)
      const { data: savedProfsData } = await supabase
        .from('saved_professors')
        .select('professors(*)')
        .eq('user_id', user.id)
        .limit(2);

      if (savedProfsData) {
        const professors = savedProfsData
          .map((item: any) => item.professors)
          .filter((prof): prof is Professor => prof !== null);
        setSavedProfessors(professors);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSavedCourses = () => {
    router.push('/saved-courses');
  };

  const navigateToSavedProfessors = () => {
    router.push('/saved-professors');
  };

  const navigateToCourse = (courseId: string | number) => {
    router.push({
      pathname: '/test',
      params: { courseId }
    });
  };

  const navigateToProfessor = (professorId: string) => {
    router.push({
      pathname: '/test',
      params: { professorId }
    });
  };

  // Handles pull-to-refresh functionality
  // Reloads saved courses and professors when user pulls down
  const onRefresh = useCallback(async () => {
    // 1. Start the loading indicator
    setRefreshing(true);

    // 2. Perform the actual refresh/data fetching
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.log('No user found');
        return;
      }

    // Load saved courses (limit to 2 for preview)
    const { data: savedCoursesData } = await supabase
      .from('saved_courses')
      .select('courses(*)')
      .eq('user_id', user.id)
      .limit(2);

    if (savedCoursesData) {
      const courses = savedCoursesData
        .map((item: any) => item.courses)
        .filter((course): course is Course => course !== null);
      setSavedCourses(courses);
    }

    // Load saved professors (limit to 2 for preview)
    const { data: savedProfsData } = await supabase
      .from('saved_professors')
      .select('professors(*)')
      .eq('user_id', user.id)
      .limit(2);

    if (savedProfsData) {
      const professors = savedProfsData
        .map((item: any) => item.professors)
        .filter((prof): prof is Professor => prof !== null);
      setSavedProfessors(professors);
    }

    // 3. Stop the loading indicator
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#627768" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Handles user sign out
  // Signs out from Supabase and redirects to login screen
  async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          // Handle the error (shows an alert)
          console.error('Error logging out:', error.message);
          return;
        }
        // State/Navigation Management handled by router
        router.push('../(auth)/login')

      } catch (err) {
        console.error('An unexpected error occurred during logout:', err);
      }
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl= {<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('@/assets/images/pathfinder_logo.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <Text style={styles.userDepartment}>{userDepartment}</Text>
          <Text style={styles.joinedDate}>{joinedDate}</Text>
        </View>

        {/* Saved Items Section */}
        <View style={styles.savedSection}>
          {/* Saved Courses */}
          <Text style={styles.sectionTitle}>Saved Courses</Text>
          {savedCourses.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="bookmark" size={40} color="#A8B5AC" />
              <Text style={styles.emptyText}>No saved courses yet</Text>
            </View>
          ) : (
            <>
              {savedCourses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.itemCard}
                  onPress={() => navigateToCourse(course.id)}
                >
                  <View style={styles.courseCardContent}>
                    <Text style={styles.courseCode}>{course.course_code}</Text>
                    <Text style={styles.courseName} numberOfLines={1}>
                      {course.course_name}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.viewFullButton}
                onPress={navigateToSavedCourses}
              >
                <Text style={styles.viewFullText}>View full list</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Saved Professors */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            Saved Professors
          </Text>
          {savedProfessors.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="bookmark" size={40} color="#A8B5AC" />
              <Text style={styles.emptyText}>No saved professors yet</Text>
            </View>
          ) : (
            <>
              {savedProfessors.map((professor) => (
                <TouchableOpacity
                  key={professor.id}
                  style={styles.itemCard}
                  onPress={() => navigateToProfessor(professor.id)}
                >
                  <View style={styles.professorImageContainer}>
                    {professor.image_url ? (
                      <Image
                        source={{ uri: professor.image_url }}
                        style={styles.professorImage}
                      />
                    ) : (
                      <View style={styles.professorPlaceholder}>
                        <Text style={styles.professorInitials}>
                          {professor.first_name?.[0]}{professor.last_name?.[0]}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.professorInfo}>
                    <Text style={styles.professorName}>{professor.full_name}</Text>
                    <Text style={styles.professorDept} numberOfLines={1}>
                      {professor.department_name}
                    </Text>
                  </View>
                  <View style={styles.professorRating}>
                    <Text style={styles.ratingNumber}>
                      {professor.rating? professor.rating : 'N/A' }
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.viewFullButton}
                onPress={navigateToSavedProfessors}
              >
                <Text style={styles.viewFullText}>View full list</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <Button title="Log Out" onPress={() => signOut()}></Button>
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
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerSection: {
    backgroundColor: '#E8E4D5',
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#627768',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userEmail: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userDepartment: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  joinedDate: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  savedSection: {
    backgroundColor: '#627768',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 20,
    minHeight: 500,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  itemCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseCardContent: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    color: '#666',
  },
  professorImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    overflow: 'hidden',
  },
  professorImage: {
    width: '100%',
    height: '100%',
  },
  professorPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#627768',
    justifyContent: 'center',
    alignItems: 'center',
  },
  professorInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  professorInfo: {
    flex: 1,
  },
  professorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  professorDept: {
    fontSize: 13,
    color: '#666',
  },
  professorRating: {
    backgroundColor: '#60A960',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  viewFullButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E8E4D5',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  viewFullText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E8E4D5',
  },
});
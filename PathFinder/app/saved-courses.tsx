import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Course } from '@/types';
import Icon from 'react-native-vector-icons/Feather';

export default function SavedCoursesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadSavedCourses();
  }, []);

  const loadSavedCourses = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: savedCoursesData } = await supabase
        .from('saved_courses')
        .select('courses(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedCoursesData) {
        const courses = savedCoursesData
          .map((item: any) => item.courses)
          .filter((course): course is Course => course !== null);
        setSavedCourses(courses);
      }
    } catch (error) {
      console.error('Error loading saved courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToCourse = (courseId: string | number) => {
    // Navigate to course detail page (to be implemented)
    console.log('Navigate to course:', courseId);
  };

  const unsaveCourse = async (courseId: string | number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('saved_courses')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      // Update local state
      setSavedCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error unsaving course:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#627768" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Courses</Text>
      </View>

      {savedCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="bookmark" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No Saved Courses</Text>
          <Text style={styles.emptyText}>
            Start saving courses to build your personalized list
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {savedCourses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <TouchableOpacity
                  style={styles.courseCardTouchable}
                  onPress={() => navigateToCourse(course.id)}
                >
                  <View style={styles.courseContent}>
                    <Text style={styles.courseCode}>{course.course_code}</Text>
                    <Text style={styles.courseName}>{course.course_name}</Text>
                    {course.course_desc && (
                      <Text style={styles.courseDesc} numberOfLines={2}>
                        {course.course_desc}
                      </Text>
                    )}
                  </View>
                  <Icon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.unsaveButton}
                  onPress={() => unsaveCourse(course.id)}
                >
                  <Icon name="bookmark" size={20} color="#627768" />
                  <Text style={styles.unsaveText}>Unsave</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  courseCardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  courseDesc: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  unsaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  unsaveText: {
    fontSize: 14,
    color: '#627768',
    fontWeight: '600',
    marginLeft: 6,
  },
});
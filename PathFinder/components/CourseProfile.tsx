// CourseProfile Component
//
// Displays detailed information about a specific course including:
// - Course description and metadata
// - List of professors teaching the course with ratings
// - Course statistics and averages
// - Save/bookmark functionality

import { ProfileDataObj } from '@/services/profileData';
import { Course, ProfessorWithRating } from '@/types';
import {
  formatRating,
  getDifficultyColor,
  getRatingColor,
  isValidNumber,
  toNumber,
} from '@/utils/formatters';
import { isCourseSaved, saveCourse, unsaveCourse } from '@/utils/savedItems';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

// Type definitions for component props
type CourseProfileProps = {
  courseId?: string;
};

type ProfessorCardProps = {
  professor: ProfessorWithRating;
  onPress: () => void;
};

// ProfessorCard Component
// Renders a professor card with course-specific ratings
// Shows professor image, name, department, and rating/difficulty badges
const ProfessorCard = ({ professor, onPress }: ProfessorCardProps) => {
  // Use course-specific rating if available, otherwise use overall rating
  const rating = toNumber(professor.courseRating ?? professor.rating);
  const difficulty = toNumber(professor.courseDifficulty ?? professor.difficulty ?? professor.diff);
  const numRatings = toNumber(professor.courseNumRatings ?? professor.num_ratings);

  return (
    <TouchableOpacity style={styles.professorCard} onPress={onPress}>
      <View style={styles.professorCardContent}>
        {/* Professor Image */}
        <View style={styles.professorImageContainer}>
          {professor.image_url ? (
            <Image
              source={{ uri: professor.image_url }}
              style={styles.professorImage}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={50} color="#666" />
          )}
        </View>

        {/* Professor Info */}
        <View style={styles.professorInfo}>
          <Text style={styles.professorName}>{professor.full_name}</Text>
          <View style={styles.departmentRow}>
            <Ionicons name="briefcase-outline" size={14} color="#666" />
            <Text style={styles.departmentText}>
              {professor.department_name || 'Department not specified'}
            </Text>
          </View>
          {numRatings > 0 && (
            <Text style={styles.ratingsCountText}>
              {numRatings} rating{numRatings !== 1 ? 's' : ''} for this course
            </Text>
          )}
        </View>

        {/* Ratings Container */}
        <View style={styles.ratingsContainer}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingLabel}>Rating</Text>
            <View
              style={[
                styles.ratingBadge,
                { backgroundColor: getRatingColor(rating) },
              ]}
            >
              <Text style={styles.ratingValue}>
                {rating > 0 ? formatRating(rating) : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.ratingBox}>
            <Text style={styles.ratingLabel}>Difficulty</Text>
            <View
              style={[
                styles.ratingBadge,
                { backgroundColor: getDifficultyColor(difficulty) },
              ]}
            >
              <Text style={styles.ratingValue}>
                {difficulty > 0 ? formatRating(difficulty) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CourseProfile({ courseId }: CourseProfileProps = {}) {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [professors, setProfessors] = useState<ProfessorWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  // Get course ID from props first, then fall back to route params
  const activeCourseId = courseId || (params.courseId as string);


  // Returns to search results if coming from search, otherwise goes back a page
  const handleBackPress = () => {
    if (params.fromSearch === 'true' && params.searchResults) {
      router.push({
        pathname: '/courses',
        params: {
          searchQuery: params.searchQuery,
          searchResults: params.searchResults,
        },
      });
    } else {
      router.back();
    }
  };

  // Effect hook to fetch course data when component mounts or courseId changes
  useEffect(() => {
    if (activeCourseId) {
      fetchCourseData();
      checkSavedStatus();
    } else {
      setError('No course ID provided');
      setLoading(false);
    }
  }, [activeCourseId]);

  // Checks if the current course is saved/bookmarked
  const checkSavedStatus = async () => {
    if (activeCourseId) {
      const saved = await isCourseSaved(activeCourseId);
      setIsSaved(saved);
    }
  };

  // Toggles the saved status of the course
  // Adds or removes course from user's saved list
  const handleToggleSave = async () => {
    if (savingInProgress || !activeCourseId) return;

    setSavingInProgress(true);
    try {
      if (isSaved) {
        const success = await unsaveCourse(activeCourseId);
        if (success) setIsSaved(false);
      } else {
        const success = await saveCourse(activeCourseId);
        if (success) setIsSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setSavingInProgress(false);
    }
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the new ProfileDataService to get complete course data
      const { course, professors: courseProfessors } =
        // Use the ProfileDataService to get complete course data
        await ProfileDataObj.getFullCourseProfile(activeCourseId);

      if (!course) {
        throw new Error('Course not found');
      }
      setCourseData(course);
      setProfessors(courseProfessors);
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to load course data');
      Alert.alert('Error', 'Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Navigates to a professor's profile page
  // Passes context about current course for back navigation
  const navigateToProfessorProfile = (professorId: string) => {
    router.push({
      pathname: '/test',
      params: {
        professorId,
        fromCourse: 'true',
        courseId: activeCourseId,
      },
    });
  };

  // Check if course has prerequisites
  const hasPrerequisites = false;

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
          <TouchableOpacity style={styles.retryButton} onPress={fetchCourseData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            onPress={handleToggleSave}
            style={styles.saveButton}
            disabled={savingInProgress}
          >
            <Icon
              name="bookmark"
              size={24}
              color={isSaved ? '#627768' : '#CCC'}
              style={{ opacity: savingInProgress ? 0.5 : 1 }}
            />
          </TouchableOpacity>
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
            <TouchableOpacity
              style={[
                styles.prerequisitesButton,
                hasPrerequisites && styles.prerequisitesButtonActive,
              ]}
            >
              <Text style={styles.prerequisitesText}>
                {hasPrerequisites ? 'View Prerequisites' : 'No Prerequisites'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Professors Section */}
          <View style={styles.professorsSection}>
            <Text style={styles.sectionHeader}>
              Professors ({professors.length})
            </Text>

            {professors.length > 0 ? (
              professors.map((professor) => (
                <ProfessorCard
                  key={professor.id || professor.full_name}
                  professor={professor}
                  onPress={() => {
                    // Only navigate if we have a valid ID (not just the name)
                    if (professor.id && professor.id !== professor.full_name) {
                      navigateToProfessorProfile(professor.id);
                    } else {
                      Alert.alert(
                        'Professor Details',
                        `${professor.full_name}\nRating: ${professor.courseRating?.toFixed(1) || 'N/A'}\nDifficulty: ${professor.courseDifficulty?.toFixed(1) || 'N/A'}`
                      );
                    }
                  }}
                />
              ))
            ) : (
              <View style={styles.noProfessorsCard}>
                <Ionicons name="school-outline" size={48} color="#CCC" />
                <Text style={styles.noProfessorsText}>
                  No professor data available for this course
                </Text>
              </View>
            )}
          </View>

          {/* Course Stats Summary */}
          {professors.length > 0 && (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Course Statistics</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{professors.length}</Text>
                  <Text style={styles.statLabel}>
                    Professor{professors.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {(() => {
                      const validRatings = professors.filter(
                        (p) => isValidNumber(p.courseRating ?? p.rating) && toNumber(p.courseRating ?? p.rating) > 0
                      );
                      if (validRatings.length === 0) return 'N/A';
                      const avg =
                        validRatings.reduce(
                          (sum, p) => sum + toNumber(p.courseRating ?? p.rating),
                          0
                        ) / validRatings.length;
                      return avg.toFixed(1);
                    })()}
                  </Text>
                  <Text style={styles.statLabel}>Avg Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {(() => {
                      const validDiffs = professors.filter(
                        (p) => isValidNumber(p.courseDifficulty ?? p.difficulty ?? p.diff) && 
                               toNumber(p.courseDifficulty ?? p.difficulty ?? p.diff) > 0
                      );
                      if (validDiffs.length === 0) return 'N/A';
                      const avg =
                        validDiffs.reduce(
                          (sum, p) => sum + toNumber(p.courseDifficulty ?? p.difficulty ?? p.diff),
                          0
                        ) / validDiffs.length;
                      return avg.toFixed(1);
                    })()}
                  </Text>
                  <Text style={styles.statLabel}>Avg Difficulty</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

// Component Styles
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
  retryButton: {
    marginTop: 20,
    backgroundColor: '#627768',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  saveButton: {
    padding: 8,
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
  prerequisitesButtonActive: {
    backgroundColor: '#627768',
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
    width: 50,
    height: 50,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  professorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  ratingsCountText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBox: {
    marginLeft: 8,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  noProfessorsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  noProfessorsText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#627768',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#E8E4D5',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
import { ProfileDataObj } from '@/services/profileData';
import { UserObj } from '@/services/user';
import { CourseWithRating, Professor } from '@/types';
import {
  formatRating,
  getRatingColor,
  isValidNumber,
  toNumber
} from '@/utils/formatters';
// import {
//   isProfessorSaved,
//   saveProfessor,
//   unsaveProfessor,
// } from '@/utils/savedItems';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

// --- Type Definitions ---
type ProfessorProfileProps = {
  professorId?: string;
};

type StarRatingProps = {
  rating: number;
};

type ClassCardProps = {
  course: CourseWithRating;
  isExpanded: boolean;
  onToggle: () => void;
  navigate: (courseId:string | number) => void;
};

/**
 * Renders the main card for a class
 */
const ClassCard = ({ course, isExpanded, onToggle, navigate }: ClassCardProps) => {
  const ratingDisplay = formatRating(course.rating);
  const ratingNum = toNumber(course.rating);
  const hasValidRating = isValidNumber(course.rating) && ratingNum > 0;

  return (
    <TouchableOpacity style={styles.classCard} onPress={() => navigate(course.id)}>
      <View style={styles.classCardTop}>
        <View style={styles.classInfo}>
          <Text style={styles.classTitle}>
            {course.course_code} {course.course_name !== course.course_code ? course.course_name : ''}
          </Text>
          {course.num_ratings != null && toNumber(course.num_ratings) > 0 && (
            <Text style={styles.classSemester}>
              {toNumber(course.num_ratings)} rating{toNumber(course.num_ratings) !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.ratingBox,
            { backgroundColor: hasValidRating ? getRatingColor(ratingNum) : '#999' },
          ]}
        >
          <Text style={styles.ratingLabel}>Overall</Text>
          <Text style={styles.ratingLabel}>Rating</Text>
          <Text style={styles.ratingText}>{ratingDisplay}</Text>
        </View>
      </View>
      {isValidNumber(course.difficulty) && toNumber(course.difficulty) > 0 && (
        <View style={styles.difficultyRow}>
          <Text style={styles.difficultyLabel}>Difficulty: </Text>
          <Text style={styles.difficultyValue}>{formatRating(course.difficulty)}/5</Text>
        </View>
      )}
      <TouchableOpacity style={styles.toggleRow} onPress={onToggle}>
        <Text style={styles.toggleText}>View reviews</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function ProfessorProfile({
  professorId,
}: ProfessorProfileProps = {}) {
  const [professorData, setProfessorData] = useState<Professor | null>(null);
  const [courses, setCourses] = useState<CourseWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  // Get professor ID from props first, then fall back to route params
  const activeProfessorId = professorId || (params.professorId as string);

  const handleBackPress = () => {
    // Check if we came from a search and have the search params
    if (params.fromSearch === 'true' && params.searchResults) {
      router.push({
        pathname: '/faculty',
        params: {
          searchQuery: params.searchQuery,
          searchResults: params.searchResults,
        },
      });
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (activeProfessorId) {
      fetchProfessorData();
      checkSavedStatus();
    } else {
      setError('No professor ID provided');
      setLoading(false);
    }
  }, [activeProfessorId]);

  const checkSavedStatus = async () => {
    if (activeProfessorId) {
      const saved = await UserObj.isProfessorSaved(activeProfessorId);
      setIsSaved(saved);
    }
  };

  const handleToggleSave = async () => {
    if (savingInProgress || !activeProfessorId) return;

    setSavingInProgress(true);
    try {
      if (isSaved) {
        const success = await UserObj.unsaveProfessor(activeProfessorId);
        if (success) setIsSaved(false);
        Alert.alert('Professor unsaved!')
      } else {
        const success = await UserObj.saveProfessor(activeProfessorId);
        if (success) setIsSaved(true);
        Alert.alert('Professor saved!')
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setSavingInProgress(false);
    }
  };

  const fetchProfessorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the new ProfileDataService to get complete professor data
      const { professor, courses: professorCourses } =
        await ProfileDataObj.getFullProfessorProfile(activeProfessorId);

      if (!professor) {
        throw new Error('Professor not found');
      }

      setProfessorData(professor);
      setCourses(professorCourses);
    } catch (err: any) {
      console.error('Error fetching professor:', err);
      setError(err.message || 'Failed to load professor data');
      Alert.alert('Error', 'Failed to load professor data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseExpanded = (courseCode: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseCode)) {
        newSet.delete(courseCode);
      } else {
        newSet.add(courseCode);
      }
      return newSet;
    });
  };

  const openLink = (url: string | undefined, type: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', `Could not open ${type} page`);
      });
    } else {
      Alert.alert('Not Available', `${type} link is not available`);
    }
  };

      // Updated to accept professor ID and pass current search context
  const navigateToCourseProfile = (courseId: string|number) => {
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

  // Loading state
  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#627768" />
          <Text style={styles.loadingText}>Loading professor...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Error state
  if (error || !professorData) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color="#E74C3C" />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>
            {error || 'Unable to load professor data'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProfessorData}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button and title */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButtonIcon}>
            <Icon name="chevron-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Professor Profile</Text>
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

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageLarge}>
            <Ionicons name="person-circle-outline" size={100} color="#627768" />
          </View>
          <Text style={styles.professorNameLarge}>{professorData.full_name}</Text>
          <Text style={styles.departmentTextLarge}>
            {professorData.department_name || 'Department not specified'}
          </Text>

          {/* Overall Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatRating(professorData.rating)}
              </Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatRating(professorData.difficulty ?? professorData.diff)}
              </Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {toNumber(professorData.num_ratings)}
              </Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Contact Info Card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Info</Text>
          <TouchableOpacity
            onPress={() => openLink(professorData.rmp_url, 'RateMyProfessors')}
            style={styles.contactLinkRow}
          >
            <Icon name="external-link" size={16} color="#627768" />
            <Text style={styles.contactLink}>
              {professorData.rmp_url ? 'View on RateMyProfessors' : 'RMP Page: Not available'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openLink(professorData.faculty_url, 'RPI Faculty')}
            style={styles.contactLinkRow}
          >
            <Icon name="external-link" size={16} color="#627768" />
            <Text style={styles.contactLink}>
              {professorData.faculty_url ? 'View RPI Faculty Page' : 'RPI Page: Not available'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Green Section with Classes */}
        <View style={styles.greenSection}>
          <Text style={styles.sectionTitle}>
            Classes ({courses.length})
          </Text>

          {courses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No class data available</Text>
            </View>
          ) : (
            courses.map((course) => (
              <ClassCard
                key={course.course_code}
                course={course}
                isExpanded={expandedCourses.has(course.course_code)}
                onToggle={() => toggleCourseExpanded(course.course_code)}
                navigate={() => navigateToCourseProfile(course.id)}
              />
            ))
          )}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#F5F5F5',
  },
  backButtonIcon: {
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E4D5',
  },
  professorNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  departmentTextLarge: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#627768',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#CCC',
  },
  contactCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactLink: {
    fontSize: 14,
    color: '#627768',
    marginLeft: 8,
  },
  greenSection: {
    backgroundColor: '#627768',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingTop: 24,
    minHeight: 400,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    marginLeft: 4,
  },
  classCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  classCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classInfo: {
    flex: 1,
    marginRight: 12,
  },
  classTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  classSemester: {
    fontSize: 13,
    color: '#666',
  },
  ratingBox: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  ratingLabel: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
  ratingText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  difficultyLabel: {
    fontSize: 13,
    color: '#666',
  },
  difficultyValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D0CCC0',
  },
  toggleText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});
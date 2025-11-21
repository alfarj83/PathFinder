import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import { Professor, Course } from '@/types';

type CourseProfileProps = {
  courseId?: string;
};

type StarRatingProps = {
  rating: number;
};

type ClassCardProps = {
  title: string;
  semester: string;
  rating: string;
  isExpanded: boolean;
  onToggle: () => void;
};

type ReviewCardProps = {
  rating: number;
  date: string;
  text: string;
};

/**
 * Renders the 5-star rating
 */
const StarRating = ({ rating }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.starRow}>
      {[...Array(fullStars)].map((_, i) => (
        <Icon key={`full-${i}`} name="star" size={16} color="#000" style={{ marginRight: 2 }} />
      ))}
      {hasHalfStar && <Icon name="star" size={16} color="#000" style={{ marginRight: 2 }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon key={`empty-${i}`} name="star" size={16} color="#CCC" style={{ marginRight: 2 }} />
      ))}
    </View>
  );
};

/**
 * Renders the main card for a class
 */
const ClassCard = ({ title, semester, rating, isExpanded, onToggle }: ClassCardProps) => (
  <View style={styles.classCard}>
    <View style={styles.classCardTop}>
      <View style={styles.classInfo}>
        <Text style={styles.classTitle}>{title}</Text>
        <Text style={styles.classSemester}>{semester}</Text>
      </View>
      <View style={styles.ratingBox}>
        <Text style={styles.ratingLabel}>Overall</Text>
        <Text style={styles.ratingLabel}>Rating</Text>
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle}>
      <Text style={styles.toggleText}>View reviews</Text>
      <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
    </TouchableOpacity>
  </View>
);

/**
 * Renders a single review card
 */
const ReviewCard = ({ rating, date, text }: ReviewCardProps) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <StarRating rating={rating} />
      <Text style={styles.reviewDate}>{date}</Text>
    </View>
    <Text style={styles.reviewText}>{text}</Text>
  </View>
);

export default function CourseProfile({ courseId }: CourseProfileProps = {}) {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentReviewsVisible, setCurrentReviewsVisible] = useState(false);
  const [pastReviewsVisible, setPastReviewsVisible] = useState(false);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get professor ID from props first, then fall back to route params
  const activeCourseId = courseId || (params.courseId as string);

  const handleBackPress = () => {
    // Check if we came from a search and have the search params
    if (params.fromSearch === 'true' && params.searchResults) {
      router.push({
        pathname: '/faculty',
        params: {
          searchQuery: params.searchQuery,
          searchResults: params.searchResults
        }
      });
    } else {
      // Otherwise just go back
      router.back();
    }
  };

  useEffect(() => {
    if (activeCourseId) {
      fetchCourseData();
    } else {
      setError('No course ID provided');
      setLoading(false);
    }
  }, [activeCourseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('courses')
        .select('id, course_code, course_name, course_desc')
        .eq('id', activeCourseId)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        throw new Error('Professor not found');
      }

      // Ensure rating and difficulty are numbers
      const processedData = {
        ...data,
      };

      setCourseData(processedData);
    } catch (err: any) {
      console.error('Error fetching professor:', err);
      setError(err.message || 'Failed to load professor data');
      Alert.alert('Error', 'Failed to load professor data. Please try again.');
    } finally {
      setLoading(false);
    }
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
  if (error || !courseData) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color="#E74C3C" />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>
            {error || 'Unable to load course data'}
          </Text>
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
          <Text style={styles.headerTitle}>Course Profile</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          </View>
          <Text style={styles.professorNameLarge}>{courseData.course_code}</Text>
          <Text style={styles.departmentTextLarge}>{courseData.course_name}</Text>

        {/* Contact Info Card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Course Description</Text>
          <Text style={styles.contactLink}>{courseData.course_desc}</Text>
        </View>

        {/* Green Section */}
        <View style={styles.greenSection}>
          <Text style={styles.sectionTitle}>Current Classes</Text>
          {/* <ClassCard
            title="CSCI-1200 Data Structures"
            semester="Fall 2025 Semester"
            rating="4.5"
            isExpanded={currentReviewsVisible}
            onToggle={() => setCurrentReviewsVisible(!currentReviewsVisible)}
          />
          {currentReviewsVisible && (
            <ReviewCard
              rating={4}
              date="Jan 8th, 2023"
              text="Tough class. It had lots of homework and was very fast paced, and that made me much better at computer scientist."
            />
          )}

          <Text style={styles.sectionTitle2}>Past Classes</Text>
          <ClassCard
            title="CSCI 4530 Advanced Computer Graphics"
            semester="Spring 2021 Semester"
            rating="5.0"
            isExpanded={pastReviewsVisible}
            onToggle={() => setPastReviewsVisible(!pastReviewsVisible)}
          /> */}
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  professorNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  departmentTextLarge: {
    fontSize: 16,
    color: '#666',
  },
  contactCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactLink: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
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
  sectionTitle2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
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
    backgroundColor: '#60A960',
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
  reviewCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
    header: {
    backgroundColor: '#E8E4D5',
    paddingTop: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
});
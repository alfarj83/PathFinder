import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaProvider} from 'react-native-safe-area-context';

interface Professor {
  id: string;
  name: string;
  department: string;
  rating: number;
  difficulty: number;
  wouldTakeAgain: number;
  numRatings: number;
  image?: string;
}

export default function FacultyScreen() {
  const router = useRouter();
  const [selectedDepartment] = useState('Communication & Media Department');

  const professors: Professor[] = [
    {
      id: '1',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
    {
      id: '2',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
    {
      id: '3',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
    {
      id: '4',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
    {
      id: '5',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
    {
      id: '6',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
    {
      id: '7',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
    {
      id: '8',
      name: 'Barbara Cutler',
      department: 'Computer Science',
      rating: 3.3,
      difficulty: 3,
      wouldTakeAgain: 65,
      numRatings: 45,
    },
  ];

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

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedDepartment}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {professors.map((professor) => (
            <TouchableOpacity key={professor.id} style={styles.professorCard}>
              <View style={styles.cardContent}>
                {/* Professor Image */}
                <View style={styles.imageContainer}>
                  <Ionicons name="person-circle-outline" size={50} color="#666" />
                </View>

                {/* Professor Info */}
                <View style={styles.professorInfo}>
                  <Text style={styles.professorName}>{professor.name}</Text>
                  <View style={styles.departmentRow}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.departmentText}>{professor.department}</Text>
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
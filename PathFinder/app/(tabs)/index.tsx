import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

    // Define the type for a single department object
    type Department = {
      code: string;
      name: string;
    };

  // The array of department objects
  const departments: Department[] = [
    { code: 'ARCH', name: 'Architecture' },
    { code: 'ARTS', name: 'Arts' },
    { code: 'ASTR', name: 'Astronomy' },
    { code: 'BCBP', name: 'Biochemistry and Biophysics' },
    { code: 'BIOL', name: 'Biology' },
    { code: 'BMED', name: 'Biomedical Engineering' },
    { code: 'BUSN', name: 'Business (H)' },
    { code: 'CHEM', name: 'Chemistry' },
    { code: 'CHME', name: 'Chemical Engineering' },
    { code: 'CIVL', name: 'Civil Engineering' },
    { code: 'COGS', name: 'Cognitive Science' },
    { code: 'COMM', name: 'Communication' },
    { code: 'CSCI', name: 'Computer Science' },
    { code: 'ECON', name: 'Economics' },
    { code: 'ECSE', name: 'Electrical, Computer, and Systems Engineering' },
    { code: 'ENGR', name: 'General Engineering' },
    { code: 'ENVE', name: 'Environmental Engineering' },
    { code: 'ERTH', name: 'Earth and Environmental Science' },
    { code: 'ESCI', name: 'Engineering Science' },
    { code: 'GSAS', name: 'Games and Simulation Arts and Sciences' },
    { code: 'IHSS', name: 'Interdisciplinary Humanities and Social Sciences' },
    { code: 'INQR', name: 'HASS Inquiry' },
    { code: 'ISCI', name: 'Interdisciplinary Science' },
    { code: 'ISYE', name: 'Industrial and Systems Engineering' },
    { code: 'ITWS', name: 'Information Technology and Web Science' },
    { code: 'LANG', name: 'Foreign Languages' },
    { code: 'LGHT', name: 'Lighting' },
    { code: 'LITR', name: 'Literature' },
    { code: 'MANE', name: 'Mechanical, Aerospace, and Nuclear Engineering' },
    { code: 'MATH', name: 'Mathematics' },
    { code: 'MATP', name: 'Mathematical Programming, Probability, and Statistics' },
    { code: 'MGMT', name: 'Management' },
    { code: 'MTLE', name: 'Materials Science and Engineering' },
    { code: 'PHIL', name: 'Philosophy' },
    { code: 'PHYS', name: 'Physics' },
    { code: 'PSYC', name: 'Psychology' },
    { code: 'STSO', name: 'Science, Technology, and Society' },
    { code: 'WRIT', name: 'Writing' },
  ];

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Pathfinder {' '}
              <View style={styles.iconCircle}>
                <Ionicons name="refresh" size={24} color="white" />
              </View>
            </Text>
            <Text style={styles.welcomeText}>Welcome, User!</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for Professors"
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Ionicons name="search" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subText}>Search for a course instead</Text>

            <TouchableOpacity style={styles.viewSavedButton}>
              <Text style={styles.viewSavedText}>View Saved</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Departments Section */}
        <View style={styles.departmentsSection}>
          <Text style={styles.sectionTitle}>EXPLORE DEPARTMENTS</Text>
          <Text style={styles.sectionSubtitle}>Humanities, Arts, and Social Sciences</Text>

          <View style={styles.departmentGrid}>
            {departments.map((dept, index) => (
              <Link key={index} href="/faculty" asChild>
                <TouchableOpacity style={styles.departmentButton}>
                  <Text style={styles.departmentCode}>{dept.code}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#5A7A6B',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 5,
  },
  subText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 15,
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

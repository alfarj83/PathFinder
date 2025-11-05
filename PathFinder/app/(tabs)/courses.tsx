// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import {
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import { SafeAreaProvider} from 'react-native-safe-area-context';

// interface Courses {//courses have id, title, act, cap, and instructors
//   id: string;
//   title: string;
//   act: number;
//   cap: number;
//   instructors: string[];
// }
// export default function courseScreen(){
//   const router = useRouter();
//   const [selectedDepartment] = useState('Communication & Media Department');

//   const courses: Courses[]=[
//     {
//         id: '1',
//         title: 'Software Developement',
//         act: 20,
//         cap: 130,
//         instructors: [
//         "Angela Marie Eaton",
//         "Jeannie Steigler"
//         ]
//     },
//         {
//         id: '2',
//         title: 'Software Developement',
//         act: 20,
//         cap: 130,
//         instructors: [
//         "Angela Marie Eaton",
//         "Jeannie Steigler"
//         ]
//     },
//         {
//         id: '3',
//         title: 'Software Developement',
//         act: 20,
//         cap: 130,
//         instructors: [
//         "Angela Marie Eaton",
//         "Jeannie Steigler"
//         ]
//     },
//         {
//         id: '4',
//         title: 'Software Developement',
//         act: 20,
//         cap: 130,
//         instructors: [
//         "Angela Marie Eaton",
//         "Jeannie Steigler"
//         ]
//     },
//         {
//         id: '5',
//         title: 'Software Developement',
//         act: 20,
//         cap: 130,
//         instructors: [
//         "Angela Marie Eaton",
//         "Jeannie Steigler"
//         ]
//     },
//         {
//         id: '6',
//         title: 'Software Developement',
//         act: 20,
//         cap: 130,
//         instructors: [
//         "Angela Marie Eaton",
//         "Jeannie Steigler"
//         ]
//     }
//   ];

//   const getRatingColor = (rating: number) => {
//     if (rating >= 4) return '#4CAF50';
//     if (rating >= 3) return '#FFA726';
//     return '#EF5350';
//   };

//   const getDifficultyColor = (difficulty: number) => {
//     if (difficulty <= 2) return '#4CAF50';
//     if (difficulty <= 3.5) return '#FFA726';
//     return '#EF5350';
//   };

//   return (
//     <SafeAreaProvider style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="chevron-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{selectedDepartment}</Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.content}>
//           {courses.map((course) => (
//             <TouchableOpacity key={course.id} style={styles.professorCard}>
//               <View style={styles.cardContent}>
//                 {/* Professor Info */}
//                 <View style={styles.professorInfo}>
//                   <Text style={styles.professorName}>{course.title}</Text>
//                   <View style={styles.departmentRow}>
//                     <Ionicons name="location-outline" size={14} color="#666" />
//                     <Text style={styles.departmentText}>{course.act}</Text>
//                   </View>
//                 </View>

//                 {/* Ratings */}
//                 <View style={styles.ratingsContainer}>
//                   <View style={styles.ratingBox}>
//                     <Text style={styles.ratingLabel}>Rating</Text>
//                     {/*<View style={[styles.ratingValue, { backgroundColor: getRatingColor(courses.rating) }]}>
//                       <Text style={styles.ratingText}>{course.cap}</Text>
//                     </View>*/}
//                   </View>
                  
//                   <View style={styles.ratingBox}>
//                     <Text style={styles.ratingLabel}>Difficulty</Text>
//                     {/*<View style={[styles.ratingValue, { backgroundColor: getDifficultyColor(courses.rating) }]}>
//                       <Text style={styles.ratingText}>{course.difficulty}/5</Text>
//                     </View>*/}
//                   </View>

//                   {/*<Text style={styles.plusRatings}>+{course.numRatings}</Text>*/}
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaProvider>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#6B8E7F',
//     paddingTop: 10,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     flex: 1,
//   },
//   content: {
//     padding: 15,
//   },
//   professorCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     marginRight: 12,
//   },
//   professorInfo: {
//     flex: 1,
//   },
//   professorName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   departmentRow: { 
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   departmentText: {
//     fontSize: 13,
//     color: '#666',
//     marginLeft: 4,
//   },
//   ratingsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingBox: {
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   ratingLabel: {
//     fontSize: 11,
//     color: '#666',
//     marginBottom: 4,
//   },
//   ratingValue: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   ratingText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   plusRatings: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '600',
//   },
// });

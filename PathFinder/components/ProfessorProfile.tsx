import { useState, useEffect } from 'react'
import { supabase }from '../utils/supabase'
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  GestureResponderEvent,
} from 'react-native';
// We'll use Feather and MaterialCommunityIcons for the icons
import Icon from 'react-native-vector-icons/Feather';

// --- Re-usable Helper Components ---
type ContactInfoRowProps = {
    icon:string,
    text:string,
};

type StarRating = {
    rating:number
};

type ClassCardProps = {
     title:string,
     semester:string,
     rating:string,
     isExpanded:boolean,
     onToggle: ((event: GestureResponderEvent) => void) | undefined,
};

type ReviewCardProps = {
    rating:number,
    date:string,
    text:string,
};

/**
 * Renders a single row in the contact card
 */
const ContactInfoRow = ({ icon, text }: ContactInfoRowProps) => (
  <View style={styles.contactRow}>
    <Icon name={icon} size={20} color="#444" />
    <Text style={styles.contactText}>{text}</Text>
  </View>
);

/**
 * Renders the 5-star rating
 */
const StarRating = ({ rating }:StarRating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.starRow}>
      {[...Array(fullStars)].map((_, i) => (
        <Icon key={`full-${i}`} name="star" size={18} color="#F1C40F" />
      ))}
      {hasHalfStar && <Icon name="star-half-full" size={18} color="#F1C40F" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon key={`empty-${i}`} name="star" size={18} color="#BDBDBD" />
      ))}
    </View>
  );
};

/**
 * Renders the main card for a class
 */
const ClassCard = ({ title, semester, rating, isExpanded, onToggle }:ClassCardProps) => (
  <View style={styles.classCard}>
    <View style={styles.classCardTop}>
      <View style={styles.classInfo}>
        <Text style={styles.classTitle}>{title}</Text>
        <Text style={styles.classSemester}>{semester}</Text>
      </View>
      <View style={styles.ratingBox}>
        <Text style={styles.ratingLabel}>Overall</Text>
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle}>
      <Text style={styles.toggleText}>View reviews</Text>
      <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#555" />
    </TouchableOpacity>
  </View>
);

/**
 * Renders a single review card
 */
const ReviewCard = ({ rating, date, text }:ReviewCardProps) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <StarRating rating={rating} />
      <Text style={styles.reviewDate}>{date}</Text>
    </View>
    <Text style={styles.reviewText}>{text}</Text>
  </View>
);

export default function ProfessorProfile() {
    const [currentReviewsVisible, setCurrentReviewsVisible] = useState(true);
    const [pastReviewsVisible, setPastReviewsVisible] = useState(false);
    const router = useRouter();

    return (
        <SafeAreaProvider style={styles.container}>
            <ScrollView>
                <View style={styles.profileHeader}>
                    <View style={styles.profileImage}>
                        <Image source={require('../assets/images/Anicca_square.png')} style={{ width: '100%', height: '100%'}}/>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{marginLeft: 30, fontWeight: 'bold', fontSize: 30}}>{"Skye Anicca"}</Text>
                        <Text style={{marginLeft: 30}}>{"Communication & Media"}</Text>
                    </View>
                </View>
                {/*contact card*/}
                <View style={styles.contactCard}>
                    <ContactInfoRow icon="mail" text="aniccs.edu" />
                    <ContactInfoRow icon="phone" text="999 999 9999" />
                    <ContactInfoRow icon="map-pin" text="SA 4206" />
                    <ContactInfoRow icon="link" text="https://faculty.rpi.edu/skye-anicca" />
                </View>
                <View style={styles.greenSection}>
                    <Text style={styles.sectionTitle}>Current Classes</Text>
                        <ClassCard
                            title="COMM-1960 Topics in Communication"
                            semester="Fall 2025 Semester"
                            rating="4.5"
                            isExpanded={currentReviewsVisible}
                            onToggle={() => setCurrentReviewsVisible(!currentReviewsVisible)}
                        />
                        {currentReviewsVisible && (
                            <ReviewCard
                            rating={4} // "Tough class" sounds like a 4-star
                            date="Jan 8th, 2023"
                            text="Tough class. It had lots of homework and was very fast paced, and that made me much better at communication."
                            />
                        )}


                    <Text style={styles.sectionTitle2}>Past Classes</Text>
                    <ClassCard
                        title="IHSS-1962 Topics in IHSS"
                        semester="Spring 2021 Semester"
                        rating="5.0"
                        isExpanded={pastReviewsVisible}
                        onToggle={() => setPastReviewsVisible(!pastReviewsVisible)}
                    />
            </View>
        </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Light beige background for the top
  },
  profileHeader: {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E8E4D5',
    paddingVertical: 50,
    alignItems: 'center',
    paddingBottom: 80,
    //marginBottom: -10,
  },
  profileImage: {
    marginLeft: 20, 
    width: '20%', 
    aspectRatio: 1, 
    alignSelf: 'center', 
    marginTop: 10,
  },
  contactCard: {
    backgroundColor: '#E8E4D5', // Darker beige card
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: -70,
    marginBottom: -120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  contactText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  greenSection: {
    flexGrow: 1, 
    backgroundColor: '#627768', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingTop: 70, 
    padding: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 50,
    marginBottom: 16,
    marginLeft: 8,
  },
  sectionTitle2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 8,
  },
  classCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  classCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classInfo: {
    flex: 1, // Allows text to wrap
    marginRight: 12,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  classSemester: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingBox: {
    backgroundColor: '#60A960',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  ratingLabel: {
    color: 'white',
    fontSize: 12,
  },
  ratingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },
  toggleText: {
    fontSize: 14,
    color: '#555',
    marginRight: 8,
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: '#E8E4D5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8, // Indent it slightly
    marginBottom: 16,
    marginTop: -8, // Slight overlap
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starRow: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#777',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
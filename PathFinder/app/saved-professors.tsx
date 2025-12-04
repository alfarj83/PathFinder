import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { Professor } from '@/types';
import Icon from 'react-native-vector-icons/Feather';

export default function SavedProfessorsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedProfessors, setSavedProfessors] = useState<Professor[]>([]);

  useEffect(() => {
    loadSavedProfessors();
  }, []);

  const loadSavedProfessors = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: savedProfsData } = await supabase
        .from('saved_professors')
        .select('professors(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedProfsData) {
        const professors = savedProfsData
          .map((item: any) => item.professors)
          .filter((prof): prof is Professor => prof !== null);
        setSavedProfessors(professors);
      }
    } catch (error) {
      console.error('Error loading saved professors:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToProfessor = (professorId: string) => {
    router.push({
      pathname: '/test',
      params: { professorId }
    });
  };

  const unsaveProfessor = async (professorId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('saved_professors')
        .delete()
        .eq('user_id', user.id)
        .eq('professor_id', professorId);

      // Update local state
      setSavedProfessors(prev => prev.filter(prof => prof.id !== professorId));
    } catch (error) {
      console.error('Error unsaving professor:', error);
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
        <Text style={styles.headerTitle}>Saved Professors</Text>
      </View>

      {savedProfessors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="bookmark" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No Saved Professors</Text>
          <Text style={styles.emptyText}>
            Start saving professors to build your personalized list
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {savedProfessors.map((professor) => (
              <View key={professor.id} style={styles.professorCard}>
                <TouchableOpacity
                  style={styles.professorCardTouchable}
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

                  <View style={styles.ratingsContainer}>
                    <View style={styles.ratingBox}>
                      <Text style={styles.ratingLabel}>Rating</Text>
                      <Text style={styles.ratingValue}>
                        {professor.rating?.toFixed(1) || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <Icon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.unsaveButton}
                  onPress={() => unsaveProfessor(professor.id)}
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
  professorCard: {
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
  professorCardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  professorImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontSize: 24,
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
    marginBottom: 4,
  },
  professorDept: {
    fontSize: 14,
    color: '#666',
  },
  ratingsContainer: {
    marginRight: 12,
  },
  ratingBox: {
    backgroundColor: '#60A960',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
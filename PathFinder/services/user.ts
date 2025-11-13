import { Professor } from '@/types';
import { mockProfessors } from '@/utils/mockData';
import { api } from '@/services/api';
import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ProfObj } from './professors';
import { Router, useRouter } from 'expo-router';

class UserService {
    public async displayMatchingProfessors(searchQuery:string, router:Router) {
        // try searching for a matching professor
        
        try {
            // this fills matchingProfessors array with matching professors
            await ProfObj.searchProfessor(searchQuery);
            let results = ProfObj.returnMatchingProfessors();

            if (results.length === 0) {
                Alert.alert('No Results', 'No professors found matching your search.');
                return;
            }

            // Navigate to faculty page with search results
            router.push({
                pathname: '/faculty',
                params: { 
                searchQuery,
                searchResults: JSON.stringify(results)
                }
            });

            //
            
            // COMING SOON: CASE FOR COURSE SEARCHING
           } //else {
        //     const results = await CourseService.searchCourses(searchQuery);
            
        //     if (results.length === 0) {
        //       Alert.alert('No Results', 'No courses found matching your search.');
        //       return;
        //     }
    
        //     // Navigate to courses page with search results
        //     // Note: You'll need to create this page later
        //     Alert.alert('Coming Soon', 'Course search will be available soon!');
        //     // Uncomment when you create the courses page:
        //     // router.push({
        //     //   pathname: '/courses',
        //     //   params: { 
        //     //     searchQuery,
        //     //     searchResults: JSON.stringify(results)
        //     //   }
        //     // });
        //   }
        catch (error) {
          console.error('Search error:', error);
          Alert.alert('Error', 'Failed to perform search. Please try again.');
        }
    };

    displayProfessorProfile(router:Router) {
        router.push('/test'); // Push a new screen onto the stack
    }

    saveProfessor() {}
    saveCourse() {}
    unsaveProfessor() {}
    unsaveCourse() {}
    selectDept() {}
    displayDeptList() {}
}

export var UserObj = new UserService();
import { Professor } from '@/types';
//import { mockProfessors } from '@/utils/mockData';
import { APIObj } from '@/services/api';
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
import { CourseObj } from './courses';

// Response type for authentication operations
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  session?: any;
}

// User actions
class UserService {
    // Store current user data
    private currentUser: any = null;
    private currentSession: any = null;

    // ============================================
    // AUTHENTICATION METHODS
    // ============================================

    /**
     * Sign up a new user
     * @param email - User's email address
     * @param password - User's password
     * @returns AuthResponse with success status and message
     */
    public async signUp(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }

            // Store user data
            this.currentUser = data.user;
            this.currentSession = data.session;

            return {
                success: true,
                message: 'Account created successfully!',
                user: data.user,
                session: data.session,
            };
        } catch (error) {
            console.error('Sign up error:', error);
            return {
                success: false,
                message: 'An unexpected error occurred during sign up',
            };
        }
    }

    /**
     * Log in an existing user
     * @param email - User's email address
     * @param password - User's password
     * @returns AuthResponse with success status and message
     */
    public async logIn(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }

            // Store user data
            this.currentUser = data.user;
            this.currentSession = data.session;

            return {
                success: true,
                message: 'Logged in successfully!',
                user: data.user,
                session: data.session,
            };
        } catch (error) {
            console.error('Log in error:', error);
            return {
                success: false,
                message: 'An unexpected error occurred during login',
            };
        }
    }

    /**
     * Log out the current user
     * @returns AuthResponse with success status
     */
    public async logOut(): Promise<AuthResponse> {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }

            // Clear stored user data
            this.currentUser = null;
            this.currentSession = null;

            return {
                success: true,
                message: 'Logged out successfully',
            };
        } catch (error) {
            console.error('Log out error:', error);
            return {
                success: false,
                message: 'An unexpected error occurred during logout',
            };
        }
    }

    /**
     * Get the currently logged in user
     * @returns Current user object or null
     */
    public async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('Get user error:', error);
                return null;
            }

            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    /**
     * Get the current session
     * @returns Current session object or null
     */
    public async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Get session error:', error);
                return null;
            }

            this.currentSession = session;
            return session;
        } catch (error) {
            console.error('Get session error:', error);
            return null;
        }
    }

    /**
     * Check if a user is currently logged in
     * @returns boolean indicating if user is authenticated
     */
    public async isAuthenticated(): Promise<boolean> {
        const session = await this.getSession();
        return session !== null;
    }

    /**
     * Send password reset email
     * @param email - User's email address
     * @returns AuthResponse with success status
     */
    public async resetPassword(email: string): Promise<AuthResponse> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }

            return {
                success: true,
                message: 'Password reset email sent!',
            };
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                message: 'An unexpected error occurred',
            };
        }
    }

    /**
     * Get cached current user (without API call)
     * @returns Cached user object or null
     */
    public getCachedUser() {
        return this.currentUser;
    }

    /**
     * Get cached session (without API call)
     * @returns Cached session object or null
     */
    public getCachedSession() {
        return this.currentSession;
    }

    // ============================================
    // EXISTING METHODS
    // ============================================

    public async displayMatchingProfessors(searchQuery: string, router: Router) {
        // Check if user is authenticated before allowing search
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            Alert.alert('Authentication Required', 'Please log in to search for professors.');
            return;
        }

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
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Error', 'Failed to perform search. Please try again.');
        }
    }

    public async displayMatchingCourses(searchQuery: string, router: Router) {
        // Check if user is authenticated before allowing search
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            Alert.alert('Authentication Required', 'Please log in to search for professors.');
            return;
        }

        try {
            // this fills matchingProfessors array with matching professors
            await CourseObj.searchCourse(searchQuery);
            let results = CourseObj.returnMatchingCourses();
            //console.log('results after returning matching courses', results)

            if (results.length === 0) {
                Alert.alert('No Results', 'No courses found matching your search.');
                return;
            }

            // Navigate to faculty page with search results
            router.push({
                pathname: '/courses',
                params: { 
                    searchQuery,
                    searchResults: JSON.stringify(results)
                }
            });
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Error', 'Failed to perform search. Please try again.');
        }
    }

    saveProfessor() {
        // TODO: Implement save professor functionality
        // This should save to the user's profile in Supabase
    }

    saveCourse() {
        // TODO: Implement save course functionality
    }

    unsaveProfessor() {
        // TODO: Implement unsave professor functionality
    }

    unsaveCourse() {
        // TODO: Implement unsave course functionality
    }

    selectDept() {
        // TODO: Implement department selection
    }

    displayDeptList() {
        // TODO: Implement department list display
    }
}

export var UserObj = new UserService();
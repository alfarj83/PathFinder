import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native';
import { ProfObj } from './professors';
import { Router } from 'expo-router';
import { CourseObj } from './courses';

// Shared shape for auth-related operations
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  session?: any;
}

// Service for authentication, basic user state, and user-specific actions
class UserService {
  // Cache of the current user object
  private currentUser: any = null;

  // Cache of the current auth session
  private currentSession: any = null;

  // Sign up a new user with email and password
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

      // Persist user and session in memory
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

  // Log in an existing user with email and password
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

      // Persist user and session in memory
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

  // Log out the current user and clear cached state
  public async logOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

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

  // Fetch the currently logged in user from Supabase and cache it
  public async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

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

  // Fetch the current auth session from Supabase and cache it
  public async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

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

  // Check if a valid session exists
  public async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  // Trigger a password reset email for the given address
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

  // Return the cached user without hitting the API
  public getCachedUser() {
    return this.currentUser;
  }

  // Return the cached session without hitting the API
  public getCachedSession() {
    return this.currentSession;
  }

  // Run a professor search and navigate to the results screen
  public async displayMatchingProfessors(searchQuery: string, router: Router) {
    // Enforce login before allowing search
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      Alert.alert('Authentication Required', 'Please log in to search for professors.');
      return;
    }

    try {
      // Populate the shared professor service with the search results
      await ProfObj.searchProfessor(searchQuery);
      const results = ProfObj.returnMatchingProfessors();

      if (results.length === 0) {
        Alert.alert('No Results', 'No professors found matching your search.');
        return;
      }

      // Navigate to the faculty screen with encoded search results
      router.push({
        pathname: '/faculty',
        params: {
          searchQuery,
          searchResults: JSON.stringify(results),
        },
      });
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to perform search. Please try again.');
    }
  }

  // Run a course search and navigate to the results screen
  public async displayMatchingCourses(searchQuery: string, router: Router) {
    // Enforce login before allowing search
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      Alert.alert('Authentication Required', 'Please log in to search for professors.');
      return;
    }

    try {
      // Populate the course service with matching courses
      await CourseObj.searchCourse(searchQuery);
      const results = CourseObj.returnMatchingCourses();

      if (results.length === 0) {
        Alert.alert('No Results', 'No courses found matching your search.');
        return;
      }

      // Navigate to the courses screen with encoded search results
      router.push({
        pathname: '/courses',
        params: {
          searchQuery,
          searchResults: JSON.stringify(results),
        },
      });
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to perform search. Please try again.');
    }
  }

  // Save a professor for the current user
  public async saveProfessor(professorId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('saved_professors')
        .insert({
          user_id: user.id,
          professor_id: professorId,
        });

      return !error;
    } catch (error) {
      console.error('Error saving professor:', error);
      return false;
    }
  }

  // Remove a saved professor for the current user
  public async unsaveProfessor(professorId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('saved_professors')
        .delete()
        .eq('user_id', user.id)
        .eq('professor_id', professorId);

      return !error;
    } catch (error) {
      console.error('Error unsaving professor:', error);
      return false;
    }
  }

  // Save a course for the current user if it is not already saved
  public async saveCourse(courseId: string | number): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      // Check for an existing saved entry for this course
      const { data, error } = await supabase
        .from('saved_courses')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', Number(courseId))
        .single();

      if (data == null) {
        const { error } = await supabase
          .from('saved_courses')
          .insert({
            user_id: user.id,
            course_id: Number(courseId),
          });

        return !error;
      }

      return !error;
    } catch (error) {
      console.error('Error saving course:', error);
      return false;
    }
  }

  // Remove a saved course for the current user
  public async unsaveCourse(courseId: string | number): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('saved_courses')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', Number(courseId));

      return !error;
    } catch (error) {
      console.error('Error unsaving course:', error);
      return false;
    }
  }

  // Check if a professor is already saved for the current user
  public async isProfessorSaved(professorId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('saved_professors')
        .select('id')
        .eq('user_id', user.id)
        .eq('professor_id', professorId)
        .single();

      return !!data && !error;
    } catch {
      return false;
    }
  }

  // Check if a course is already saved for the current user
  public async isCourseSaved(courseId: string | number): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('saved_courses')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      return !!data && !error;
    } catch {
      return false;
    }
  }
}

// Shared instance of the user service used across the app
export var UserObj = new UserService();

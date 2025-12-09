// services/professors.ts
import { Professor, Course, Rating } from '@/types';
//import { mockProfessors } from '@/utils/mockData';
import { supabase } from '@/utils/supabase';
//const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? "true") === "true";

class ProfessorService {
  // internal record of all matching professors within a professorSearch
  private matchingProfessors: Professor[] = [];

  /* GETTERS */
  // returns Professor[]
  returnMatchingProfessors() {
    return this.matchingProfessors;
  }
    /**
   * Fetch complete professor data by ID
   */
  async getProfessorById(professorId: string): Promise<Professor | null> {
    try {
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .eq('id', professorId)
        .single();

      if (error) {
        console.error('Error fetching professor:', error);
        return null;
      }

      return data as Professor;
    } catch (error) {
      console.error('Error in getProfessorById:', error);
      return null;
    }
  }

    /**
     * Get courses taught by a professor using the professor_courses table
     * Returns course codes as an array
     */
    async getProfessorCourses(professorName: string): Promise<string[]> {
      try {
        const { data, error } = await supabase
          .from('professor_courses')
          .select('Courses')
          .eq('Professor', professorName)
          .single();
  
        if (error || !data) {
          console.log('No courses found for professor:', professorName);
          return [];
        }
  
        // Split the comma-separated course codes
        const courseCodes = data.Courses
          .split(',')
          .map((code: string) => code.trim())
          .filter((code: string) => code.length > 0);
  
        return courseCodes;
      } catch (error) {
        console.error('Error fetching professor courses:', error);
        return [];
      }
    }

    /**
     * Get ratings for a specific professor and course from the ratings table
     */
    async getProfessorCourseRating(
      professorName: string,
      courseCode: string
    ): Promise<Rating | null> {
      try {
        const { data, error } = await supabase
          .from('ratings')
          .select('*')
          .eq('prof_name', professorName)
          .eq('class_code', courseCode)
          .single();
  
        if (error) {
          // Not found is okay, just return null
          return null;
        }
  
        return data as Rating;
      } catch (error) {
        console.error('Error fetching rating:', error);
        return null;
      }
    }

    /**
       * Get all ratings for a professor across all courses
       */
      async getAllProfessorRatings(professorName: string): Promise<Rating[]> {
        try {
          const { data, error } = await supabase
            .from('ratings')
            .select('*')
            .eq('prof_name', professorName);
    
          if (error) {
            console.error('Error fetching professor ratings:', error);
            return [];
          }
    
          return (data || []) as Rating[];
        } catch (error) {
          console.error('Error in getAllProfessorRatings:', error);
          return [];
        }
      }

  /* SETTERS */
    // 1. Make the function async so you can use 'await'
  async searchProfessor(q: string): Promise<void> {
    // The 'supabase' variable is the Supabase client
    if (supabase) {
      
      // 2. Prepare the search term for a 'contains' query (ilike = case-insensitive)
      const searchQuery = `%${q}%`;
      console.log(searchQuery) // gets to here

      // 3. Build the .or() filter string. This searches for the query in any of the specified columns.
      // Note: Adjust this if your column names are different!
      const filterString = [
        `full_name.ilike.${searchQuery}`,
        `first_name.ilike.${searchQuery}`,
        `last_name.ilike.${searchQuery}`,
        `department_name.ilike.${searchQuery}`
      ].join(','); // .or() takes a comma-separated string

        // 4. Await the database query
        const { data, error } = await supabase
          .from('professors') // Make sure 'professors' is your table name
          .select()            // Get all columns
          .or(filterString);   // Apply the multi-column search
  
        if (error) {
          console.log(error)
          console.error('Error searching professors:', error);
        }
  
        this.matchingProfessors = (data ?? []) as Professor[];
      }
    }
    
  /**
   * Get professor by UUID (if using UUID field)
   */
  async getProfessorByUuid(uuid: string): Promise<Professor | null> {
    try {
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .eq('uuid', uuid)
        .single();

      if (error) {
        return null;
      }

      return data as Professor;
    } catch (error) {
      console.error('Error fetching professor by UUID:', error);
      return null;
    }
  }
}

export var ProfObj = new ProfessorService();
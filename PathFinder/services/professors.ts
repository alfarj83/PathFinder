// services/professors.ts
import { Professor, Course } from '@/types';
import { APIObj } from '@/services/api';
import { supabase } from '@/utils/supabase';
import { DeptObj } from './departments';
import { CourseObj } from './courses';
const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? "true") === "true";

class ProfessorService {
  // internal record of all matching professors within a professorSearch
  private matchingProfessors: Professor[] = [];
  private currentCourses: typeof CourseObj[] = [];
  private previousCourses: typeof CourseObj[] = [];

  /* GETTERS */
  //returns Professor[]
  returnMatchingProfessors() {
    return this.matchingProfessors;
  }
  // returns Course[]
  returnCurrentCourses() {
    return this.currentCourses;
  }
  //returns Course[]
  returnPreviousCourses() {
    return this.previousCourses;
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
}

export var ProfObj = new ProfessorService();
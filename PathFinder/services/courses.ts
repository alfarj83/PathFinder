// services/courses.ts
import { Course, Professor } from '@/types';
import { supabase } from '@/utils/supabase';
import { ProfObj } from './professors';

class CourseService {
  // internal record of all matching professors within a professorSearch
  private matchingCourses: Course[] = [];
  private currentProfs: typeof CourseObj[] = [];
  private previousProfs: typeof CourseObj[] = [];

  /* GETTERS */
  //returns Course[]
  returnMatchingCourses() {
    return this.matchingCourses;
  }
  // returns Professor[]
  returnCurrentProfessors() {
    return this.currentProfs;
  }
  //returns Professor[]
  returnPreviousProfessors() {
    return this.previousProfs;
  }

  /* SETTERS */
      // 1. Make the function async so you can use 'await'
  public async searchCourse(q: string): Promise<void> {
    // The 'supabase' variable is the Supabase client
    if (supabase) {
      
      // 2. Prepare the search term for a 'contains' query (ilike = case-insensitive)
      const searchQuery = `%${q}%`;
      console.log(searchQuery) // gets to here

      // 3. Build the .or() filter string. This searches for the query in any of the specified columns.
      // Note: Adjust this if your column names are different!
      const filterString = [
        `course_code.ilike.${searchQuery}`,
        `course_name.ilike.${searchQuery}`,
      ].join(','); // .or() takes a comma-separated string

      // 4. Await the database query
      const { data, error } = await supabase
        .from('courses') // Make sure 'professors' is your table name
        .select()            // Get all columns
        .or(filterString);   // Apply the multi-column search

      if (error) {
        console.log(error)
        console.error('Error searching courses:', error);
      }

      this.matchingCourses = (data ?? []) as Course[];
    }
  }
      //console.log("this is the matching professors array:", this.matchingProfessors);

  getCurrentCourses() {
    
  }
  getPreviousCourses(){

  }
  getCourses() {

  }
  returnPreviousProfReviews() {}
  returnCurrentProfReviews() {}
  selectCourseCard() {}
}

export var CourseObj = new CourseService();
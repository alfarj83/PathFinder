// services/courses.ts
import { Course, Professor, ProfessorWithRating } from '@/types';
import { supabase } from '@/utils/supabase';

// 
//  CourseService (Singleton)
//  -------------------------
//  This class is implemented using the Singleton design pattern. Instead of 
//  creating new CourseService objects in different files, we export one 
//  shared instance at the bottom of this file (`CourseObj`). 
//  
//  Why Singleton?
//    - Ensures all screens use the same course-data source.
//    - Keeps in-memory state consistent (ex: matchingCourses from search).
//    - Prevents duplicate Supabase queries from multiple, unnecessary instances.
//    - Makes the service behave like a small shared "course database".
//  
//   Example Usage:
//     const course = await CourseObj.getCourseById(id);
//     const profs  = await CourseObj.getProfessorsForCourse(code);
//  
//   This shared instance is also used inside the Facade 
//   (ProfileDataService.getFullCourseProfile), which pulls together several 
//   nested operations into one simplified call for the UI.
//
class CourseService {
  // Keep the latest set of matching courses from the last search
  private matchingCourses: Course[] = [];

  // Return the most recent course search results
  returnMatchingCourses() {
    return this.matchingCourses;
  }

  async getCourseById(courseId: string | number): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        return null;
      }

      return data as Course;
    } catch (error) {
      console.error('Error in getCourseById:', error);
      return null;
    }
  }

  // Look up all professors with ratings associated to a given course code
  async getProfessorsForCourse(courseCode: string): Promise<ProfessorWithRating[]> {
    try {
      // Get all ratings rows for this course
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('class_code', courseCode);

      if (ratingsError || !ratings || ratings.length === 0) {
        console.log('No ratings found for course:', courseCode);
        return [];
      }

      const professorsWithRatings: ProfessorWithRating[] = [];

      // For each rating, try to find a matching professor row
      for (const rating of ratings) {
        const { data: profData, error: profError } = await supabase
          .from('professors')
          .select('*')
          .eq('full_name', rating.prof_name)
          .single();

        if (profData && !profError) {
          professorsWithRatings.push({
            ...profData,
            courseRating: rating.rating,
            courseDifficulty: rating.diff,
            courseNumRatings: rating.num_ratings,
          });
        } else {
          // Fall back to a minimal professor entry if they are not in the table
          professorsWithRatings.push({
            id: rating.prof_name,
            full_name: rating.prof_name,
            rating: rating.rating,
            courseRating: rating.rating,
            courseDifficulty: rating.diff,
            courseNumRatings: rating.num_ratings,
          });
        }
      }

      return professorsWithRatings;
    } catch (error) {
      console.error('Error fetching professors for course:', error);
      return [];
    }
  }

  // Search courses by code or name and update the in-memory results
  public async searchCourse(q: string): Promise<void> {
    if (supabase) {
      // Wrap the query string for a case-insensitive "contains" match
      const searchQuery = `%${q}%`;
      console.log(searchQuery); // Confirm the search pattern used

      // Build the .or() filter to search both course_code and course_name
      const filterString = [
        `course_code.ilike.${searchQuery}`,
        `course_name.ilike.${searchQuery}`,
      ].join(',');

      const { data, error } = await supabase
        .from('courses')
        .select()
        .or(filterString);

      if (error) {
        console.log(error);
        console.error('Error searching courses:', error);
      }

      // Fall back to an empty array if Supabase returned null
      this.matchingCourses = (data ?? []) as Course[];
    }
  }

  // Fetch a single course row by its course_code
  async getCourseByCode(courseCode: string): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('course_code', courseCode)
        .single();

      if (error) {
        return null;
      }

      return data as Course;
    } catch (error) {
      console.error('Error fetching course by code:', error);
      return null;
    }
  }
}

//
//  Singleton Instance
//  ------------------
//  Only one CourseService object is created for the whole application.
//  All imports reference the same instance, which maintains shared state 
//  such as cached course search results.
// 

// Export a shared instance so consumers do not create their own
export var CourseObj = new CourseService();

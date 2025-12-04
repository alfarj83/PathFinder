//services/profileData.ts

//Centralized service for fetching profile data from Supabase
import {
  Course,
  CourseWithRating,
  Professor,
  ProfessorWithRating,
  Rating,
} from '@/types';
import { supabase } from '@/utils/supabase';

/**
 * ProfileDataService handles all data fetching for Professor and Course profiles
 */
class ProfileDataService {
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

  /**
   * Get course details by course code
   */
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

  /**
   * Fetch complete professor profile with all courses and ratings
   * This is the main method to call for the Professor Profile screen
   */
  async getFullProfessorProfile(professorId: string): Promise<{
    professor: Professor | null;
    courses: CourseWithRating[];
  }> {
    // 1. Get professor basic info
    const professor = await this.getProfessorById(professorId);
    if (!professor) {
      return { professor: null, courses: [] };
    }

    // 2. Get all courses this professor teaches
    const courseCodes = await this.getProfessorCourses(professor.full_name);

    // 3. Get all ratings for this professor
    const allRatings = await this.getAllProfessorRatings(professor.full_name);

    // 4. Build courses with ratings
    const coursesWithRatings: CourseWithRating[] = [];

    for (const courseCode of courseCodes) {
      // Get course details
      const course = await this.getCourseByCode(courseCode);

      // Find rating for this course
      const rating = allRatings.find((r) => r.class_code === courseCode);

      if (course) {
        coursesWithRatings.push({
          ...course,
          rating: rating?.rating,
          difficulty: rating?.diff,
          num_ratings: rating?.num_ratings,
        });
      } else {
        // Course not in courses table, but we have a rating
        // Create a minimal course entry from the rating
        if (rating) {
          coursesWithRatings.push({
            id: courseCode,
            course_code: courseCode,
            course_name: courseCode, // Use code as name if not found
            rating: rating.rating,
            difficulty: rating.diff,
            num_ratings: rating.num_ratings,
          });
        }
      }
    }

    // Also add any ratings for courses not in professor_courses
    for (const rating of allRatings) {
      const exists = coursesWithRatings.some(
        (c) => c.course_code === rating.class_code
      );
      if (!exists) {
        const course = await this.getCourseByCode(rating.class_code);
        coursesWithRatings.push({
          id: rating.class_code,
          course_code: rating.class_code,
          course_name: course?.course_name || rating.class_code,
          course_desc: course?.course_desc,
          rating: rating.rating,
          difficulty: rating.diff,
          num_ratings: rating.num_ratings,
        });
      }
    }

    return { professor, courses: coursesWithRatings };
  }

  // Course profile data fetching

  /**
   * Fetch course data by ID
   */
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

  /**
   * Get all professors who teach a specific course
   * Uses the ratings table to find professors with ratings for this course
   */
  async getProfessorsForCourse(courseCode: string): Promise<ProfessorWithRating[]> {
    try {
      // 1. Get all ratings for this course
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('class_code', courseCode);

      if (ratingsError || !ratings || ratings.length === 0) {
        console.log('No ratings found for course:', courseCode);
        return [];
      }

      // 2. For each rating, get the professor's full info
      const professorsWithRatings: ProfessorWithRating[] = [];

      for (const rating of ratings) {
        // Search for professor by name
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
          // Professor not in professors table, create minimal entry from rating
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

  /**
   * Alternative: Get professors using professor_courses table
   * This finds professors whose Courses field contains the course code
   */
  async getProfessorsForCourseFromMapping(courseCode: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('professor_courses')
        .select('Professor, Courses');

      if (error || !data) {
        return [];
      }

      // Filter professors whose Courses string contains this course code
      const professorNames = data
        .filter((row) => {
          const courses = row.Courses.split(',').map((c: string) => c.trim());
          return courses.includes(courseCode);
        })
        .map((row) => row.Professor);

      return professorNames;
    } catch (error) {
      console.error('Error fetching professors from mapping:', error);
      return [];
    }
  }

  /**
   * Fetch complete course profile with all professors and their ratings
   * This is the main method to call for the Course Profile screen
   */
  async getFullCourseProfile(courseId: string | number): Promise<{
    course: Course | null;
    professors: ProfessorWithRating[];
  }> {
    // 1. Get course basic info
    const course = await this.getCourseById(courseId);
    if (!course) {
      return { course: null, professors: [] };
    }

    // 2. Get all professors for this course with their ratings
    const professors = await this.getProfessorsForCourse(course.course_code);

    return { course, professors };
  }

  // Utility methods
  /**
   * Search professors by name (partial match)
   */
  async searchProfessors(query: string): Promise<Professor[]> {
    try {
      const searchQuery = `%${query}%`;

      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .or(
          `full_name.ilike.${searchQuery},first_name.ilike.${searchQuery},last_name.ilike.${searchQuery}`
        );

      if (error) {
        console.error('Error searching professors:', error);
        return [];
      }

      return (data || []) as Professor[];
    } catch (error) {
      console.error('Error in searchProfessors:', error);
      return [];
    }
  }

  /**
   * Search courses by code or name (partial match)
   */
  async searchCourses(query: string): Promise<Course[]> {
    try {
      const searchQuery = `%${query}%`;

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`course_code.ilike.${searchQuery},course_name.ilike.${searchQuery}`);

      if (error) {
        console.error('Error searching courses:', error);
        return [];
      }

      return (data || []) as Course[];
    } catch (error) {
      console.error('Error in searchCourses:', error);
      return [];
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

export const ProfileDataObj = new ProfileDataService();
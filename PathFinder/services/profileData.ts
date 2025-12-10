// services/profileData.ts
//
// Centralized service for fetching profile data for Professor and Course screens
//
// ProfileDataService - FACADE PATTERN IMPLEMENTATION
//
// DESIGN PATTERN: Facade
// PURPOSE: Provides a simplified interface to complex data fetching operations
//          that require coordinating multiple service calls and data transformations
//
// WHY FACADE WAS CHOSEN:
// 1. Course and professor profiles require data from multiple database tables
// 2. Complex operations like joining ratings with professors need to be hidden
// 3. Multiple UI components need the same composite data structures
// 4. Reduces coupling between UI components and the underlying service architecture
// 5. Makes error handling easier to maintain
//
// BENEFITS:
// - Simplifies client code: One method call instead of orchestrating multiple calls
// - Encapsulated complexity: Hides database queries, data merging, and error handling
// - Maintainable: Changes to data fetching only affect this facade
// - Consistent: Ensures all profile screens fetch data the same way
// - Reduced coupling: UI components don't need to understand service internals
import {
  Course,
  CourseWithRating,
  Professor,
  ProfessorWithRating,
} from '@/types';
import { CourseObj } from './courses';
import { ProfObj } from './professors';

class ProfileDataService {
  // FACADE METHOD #1: Get Full Course Profile
  //
  // FACADE PATTERN: This method provides a unified interface to complex subsystem operations
  //
  // WHAT IT HIDES (Complex Subsystem):
  // 1. CourseObj.getCourseById() - Database query for course record
  // 2. CourseObj.getProfessorsForCourse() - Multiple operations:
  //    a. Query ratings table for course-specific ratings
  //    b. For each rating, query professors table
  //    c. Merge professor data with rating data
  //    d. Handle fallback cases for missing professors
  //
  // WHAT IT PROVIDES (Simple Interface):
  // - Single method call that returns everything needed for a course profile
  // - Complete course information + all professors with course-specific ratings
  // - Consistent error handling across all operations
  //
  // WITHOUT FACADE (Complex client code):
  //   const course = await CourseObj.getCourseById(courseId);
  //   if (!course) return;
  //   const professors = await CourseObj.getProfessorsForCourse(course.course_code);
  //   // Client must understand the relationship between course and ratings
  //
  // WITH FACADE (Simple client code):
  //   const { course, professors } = await ProfileDataObj.getFullCourseProfile(courseId);
  //   // Everything is ready to use in one call!
  //
  //
  // Build a full professor profile: base info + all taught courses + ratings
  async getFullProfessorProfile(professorId: string): Promise<{
    professor: Professor | null;
    courses: CourseWithRating[];
  }> {
    // Fetch base professor record
    const professor = await ProfObj.getProfessorById(professorId);
    if (!professor) {
      return { professor: null, courses: [] };
    }

    // Look up all course codes this professor is associated with
    const courseCodes = await ProfObj.getProfessorCourses(professor.full_name);

    // Fetch every rating row for this professor across all courses
    const allRatings = await ProfObj.getAllProfessorRatings(professor.full_name);

    const coursesWithRatings: CourseWithRating[] = [];

    // Attach ratings to each course the professor teaches
    for (const courseCode of courseCodes) {
      const course = await CourseObj.getCourseByCode(courseCode);
      const rating = allRatings.find((r) => r.class_code === courseCode);

      if (course) {
        coursesWithRatings.push({
          ...course,
          rating: rating?.rating,
          difficulty: rating?.diff,
          num_ratings: rating?.num_ratings,
        });
      } else {
        // Course is missing from the courses table, but we still have rating info
        if (rating) {
          coursesWithRatings.push({
            id: courseCode,
            course_code: courseCode,
            course_name: courseCode, // Use code as a fallback name
            rating: rating.rating,
            difficulty: rating.diff,
            num_ratings: rating.num_ratings,
          });
        }
      }
    }

    // Add any extra rated courses that were not listed in professor_courses
    for (const rating of allRatings) {
      const exists = coursesWithRatings.some(
        (c) => c.course_code === rating.class_code
      );
      if (!exists) {
        const course = await CourseObj.getCourseByCode(rating.class_code);
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

  // FACADE METHOD #2: Get Full Professor Profile
  //
  // FACADE PATTERN: Similar to getFullCourseProfile, this provides a unified interface
  //
  // WHAT IT HIDES (Complex Subsystem):
  // 1. ProfessorObj.getProfessorById() - Database query for professor record
  // 2. ProfessorObj.getCoursesForProfessor() - Multiple operations:
  //    a. Query ratings table for professor-specific ratings
  //    b. For each rating, query courses table
  //    c. Merge course data with rating data
  //    d. Handle fallback cases for missing courses
  //
  // WHAT IT PROVIDES (Simple Interface):
  // - Single method call for complete professor profile data
  // - Professor information + all courses with professor-specific ratings
  //
  // Build a full course profile: base info + all professors with ratings
  async getFullCourseProfile(courseId: string | number): Promise<{
    course: Course | null;
    professors: ProfessorWithRating[];
  }> {
    // Fetch base course record
    const course = await CourseObj.getCourseById(courseId);
    if (!course) {
      return { course: null, professors: [] };
    }

    // Fetch all professors tied to this course and attach rating fields
    const professors = await CourseObj.getProfessorsForCourse(course.course_code);

    return { course, professors };
  }
}

// SINGLETON PATTERN: Export a shared instance
// Ensures all parts of the application use the same facade instance
// This promotes consistency and reduces memory overhead

// Shared instance used by profile-related screens
export const ProfileDataObj = new ProfileDataService();

// USAGE EXAMPLE in CourseProfile component:
//
// const fetchCourseData = async () => {
//   try {
//     setLoading(true);
//     
//     // BEFORE FACADE (Complex - requires knowledge of service internals):
//     // const course = await CourseObj.getCourseById(activeCourseId);
//     // if (!course) throw new Error('Course not found');
//     // const professors = await CourseObj.getProfessorsForCourse(course.course_code);
//     // setCourseData(course);
//     // setProfessors(professors);
//     
//     // AFTER FACADE (Simple - one method call):
//     const { course, professors } = await ProfileDataObj.getFullCourseProfile(activeCourseId);
//     
//     if (!course) {
//       throw new Error('Course not found');
//     }
//     
//     setCourseData(course);
//     setProfessors(professors);
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };
//
// KEY BENEFITS:
// 1. UI component doesn't need to know about CourseService internals
// 2. No need to understand the relationship between courses and ratings tables
// 3. Single point of failure and error handling
// 4. If data fetching logic changes, only the facade needs updating
// 5. Easier to test - mock one method instead of multiple service calls

// services/profileData.ts

// Centralized service for fetching profile data for Professor and Course screens
import {
  Course,
  CourseWithRating,
  Professor,
  ProfessorWithRating,
} from '@/types';
import { CourseObj } from './courses';
import { ProfObj } from './professors';

class ProfileDataService {
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

// Shared instance used by profile-related screens
export const ProfileDataObj = new ProfileDataService();

// Basic department metadata from dept_list or departments table
export interface Department {
  id: string;
  category: string;
  code: string;
  name: string;
  fullName?: string;
}

// Core professor shape aggregated from professors, ratings, etc.
export interface Professor {
  id: string;
  uuid?: string;
  prof_name?: string;        // Name as stored in ratings table
  class_code?: string;       // Course code as stored in ratings table
  num_ratings?: number;      // Count of ratings in ratings table
  rating: number;
  difficulty?: number;
  diff?: number;             // Difficulty as stored in ratings table
  faculty_url?: string;
  rmp_url?: string;
  department_name?: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  department_code?: string;
  image_url?: string;
  reviews?: Review[];
}

// Canonical course shape used across views
export interface Course {
  id: string | number;
  course_code: string;
  course_name: string;
  course_desc?: string;
}

// Rating row for a specific professor + course from the ratings table
export interface Rating {
  id: number;
  prof_name: string;
  class_code: string;
  num_ratings: number;
  rating: number;
  diff: number;
}

// Mapping of one professor to a comma-separated list of course codes
export interface ProfessorCourses {
  Professor: string;
  Courses: string;
}

// Combined search results for professors and courses
export interface SearchResult {
  professors: Professor[];
  courses: Course[];
}

// Single user-submitted review for a professor or course
export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  authorId: string;
}

// Application user with saved items pre-resolved
export interface User {
  id: string;
  name: string;
  email: string;
  savedProfessors: Professor[];
  savedCourses: Course[];
}

// Professor view model with courses grouped by current vs past
export interface ProfessorWithCourses extends Professor {
  currentCourses?: CourseWithRating[];
  pastCourses?: CourseWithRating[];
}

// Course view model with aggregated rating fields
export interface CourseWithRating extends Course {
  rating?: number;
  difficulty?: number;
  num_ratings?: number;
  semester?: string;
}

// Course view model with professor lists for current and past teaching
export interface CourseWithProfessors extends Course {
  currentProfessors?: ProfessorWithRating[];
  pastProfessors?: ProfessorWithRating[];
}

// Professor view model with rating fields specific to a single course
export interface ProfessorWithRating extends Professor {
  courseRating?: number;
  courseDifficulty?: number;
  courseNumRatings?: number;
}

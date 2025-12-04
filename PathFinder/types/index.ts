export interface Department {
  id: string;
  category: string;
  code: string;
  name: string;
  fullName?: string;
}

export interface Professor {
  id: string;
  uuid?: string;
  prof_name?: string;
  class_code?: string;
  num_ratings?: number;
  rating: number;
  difficulty?: number;
  diff?: number;
  faculty_url?: string;
  rmp_url?: string;
  department_name?: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  department_code?: string;
  image_url?: string,
  reviews?: Review[];
}

export interface Course {
  id: string|number;
  //id: string,
  course_code: string;
  course_name: string;
  course_desc?: string;
  // department: string,
  // departmentCode: string,
  // description: string,
  // credits: number,
  // difficulty?: number,
  // prerequisites?: string[],
  // professors?: string[],

}

//Rating data from the ratings table (per professor per course)
export interface Rating{
  id: number;
  prof_name: string;
  class_code: string;
  num_ratings: number;
  rating: number;
  diff: number;
}

//Professor to courses mapping from professor_courses table
export interface ProfessorCourses {
  Professor: string;
  Courses: string;
}

export interface SearchResult {
  professors: Professor[];
  courses: Course[];
}

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    authorId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedProfessors: Professor[];
  savedCourses: Course[];
}

//Extended types for profile views
export interface ProfessorWithCourses extends Professor {
  currentCourses?: CourseWithRating[];
  pastCourses?: CourseWithRating[];
}

export interface CourseWithRating extends Course {
  rating?: number;
  difficulty?: number;
  num_ratings?: number;
  semester?: string;
}

export interface CourseWithProfessors extends Course {
  currentProfessors?: ProfessorWithRating[];
  pastProfessors?: ProfessorWithRating[];
}

export interface ProfessorWithRating extends Professor {
  courseRating?: number;
  courseDifficulty?: number;
  courseNumRatings?: number;
}
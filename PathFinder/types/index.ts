export interface Department {
  id: string,
  category: string,
  code: string,
  name: string,
  fullName?: string,
}

export interface Professor {
  id: string,
  prof_name: string,
  class_code: string,
  num_ratings?: number,
  rating: number,
  diff: number,
  department_name?: string,
  full_name?: string
  first_name?: string,
  last_name?: string,
  department_code?: string,
  image_url?: string,
  reviews?: Review[];
}

export interface Course {
  id: string|number,
  //id: string,
  course_code: string,
  course_name: string,
  course_desc: string,
  // department: string,
  // departmentCode: string,
  // description: string,
  // credits: number,
  // difficulty?: number,
  // prerequisites?: string[],
  // professors?: string[],

}

export interface SearchResult {
  professors: Professor[],
  courses: Course[],
}

export interface Review {
    id: string,
    rating: number,
    comment: string,
    createdAt: Date,
    authorId: string,
}

export interface User {
  id: string,
  name: string,
  email: string,
  savedProfessors: Professor[],
  savedCourses: Course[],
}
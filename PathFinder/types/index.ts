export interface Department {
  id: string,
  category: string,
  code: string,
  name: string,
  fullName?: string,
}

export interface Professor {
  id: string,
  full_name: string
  first_name: string,
  last_name: string,
  department_name: string,
  department_code: string,
  image_url?: string,
  rating: number,
  difficulty: number,
  would_take_again: number,
  num_ratings: number,
  email: string,
  officeLocation?: string,
}

export interface Course {
  id: string,
  code: string,
  name: string,
  department: string,
  departmentCode: string,
  description: string,
  credits: number,
  difficulty?: number,
  prerequisites?: string[],
  professors?: string[],
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
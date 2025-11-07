export interface Department {
  id: string;
  code: string;
  name: string;
  fullName?: string;
}

export interface Professor {
  id: string,
  name: string
  firstName: string,
  lastName: string,
  department: string,
  departmentCode: string,
  rating: number,
  difficulty: number,
  wouldTakeAgain: number,
  numRatings: number,
  email: string,
  officeLocation: string,
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
  professors: Professor[];
  courses: Course[];
}
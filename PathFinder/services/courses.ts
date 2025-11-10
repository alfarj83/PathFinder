// services/courses.ts
import { Course, Professor } from '@/types';
import { mockCourses } from '@/utils/mockData';
import { api } from '@/services/api';
const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? "true") === "true";

// export const courseService = {
//   getAllCourses: () => USE_MOCK
//     ? Promise.resolve(mockCourses)
//     : api.get<Course[]>('/courses'),

//   getCoursesByDepartment: (departmentCode: string) => USE_MOCK
//     ? Promise.resolve(mockCourses.filter(c => c.departmentCode === departmentCode))
//     : api.get<Course[]>('/courses', { department: departmentCode }),

//   searchCourses: (q: string) => USE_MOCK
//     ? Promise.resolve(
//         mockCourses.filter(c =>
//           [c.code, c.name, c.department].some(x =>
//             x.toLowerCase().includes(q.toLowerCase())
//           )
//         )
//       )
//     : api.get<Course[]>('/courses/search', { q }),
// };

class CourseService {
  private currentProfessors:Professor[] = [];
  private previousProfessors:Professor[] = [];

  getCurrentCourses() {
    
  }
  getPreviousCourses(){

  }
  getCourses() {

  }
  returnCurrentProfessors() {}
  returnPreviousProfessors() {}
  returnPreviousProfReviews() {}
  returnCurrentProfReviews() {}
  searchCourse() {}
  selectCourseCard() {}
  returnMatchingCourses() {}
}

export var CourseObj = new CourseService();
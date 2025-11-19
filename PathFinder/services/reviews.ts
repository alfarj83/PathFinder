// services/professors.ts
import { Professor } from '@/types';
//import { mockProfessors } from '@/utils/mockData';
import { APIObj } from '@/services/api';
//import { supabase } from '@/utils/supabase';

class ProfessorReview {
    // returns string[]
    getProfessorReviews() {}
}

class CourseReview {
    
    // returns string[]
    getCurrentCourseReview() {}
    // returns string[]
    getPreviousCourseReview() {}
}

export const ProfReviewObj = new ProfessorReview();
export const CourseReviewObj = new CourseReview();
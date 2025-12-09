// services/departments.ts
import { Course, Department } from '@/types';
import { APIObj } from '@/services/api';
import { supabase } from '@/utils/supabase';
import { Professor } from '@/types';

class DepartmentService {
  // Fetch a list of all departments from the 'dept_list' table
  async getDeptList(): Promise<Department[]> {
    if (supabase) {
      const { data } = await supabase
        .from('dept_list')
        .select();

      return data as Department[];
    } else {
      console.log('Department data was not collected');
      return [];
    }
  }

  // Get a single department by its department code using the REST API
  async getDepartmentByCode(code: string): Promise<Department | null> {
    return APIObj.get<Department>(`/departments/${code}`);
  }

  // Fetch all professors that belong to a specific department name
  async getDeptProfessors(dept_name: string): Promise<Professor[]> {
    if (supabase) {
      // Prepare a case-insensitive "contains" search query
      const searchQuery = `%${dept_name}%`;
      console.log('here is searchQuery:', searchQuery);

      // Query the 'professors' table for matching department names
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .ilike('department_name', searchQuery);

      if (data == null) {
        return [];
      }

      if (error) {
        console.log(error);
        console.error('Error fetching department:', error);
      }

      return data as Professor[];
    } else {
      return [];
    }
  }

  // Fetch all courses that belong to a department based on course code pattern
  async getDeptCourses(course_code: string): Promise<Course[]> {
    if (supabase) {
      // Prepare a case-insensitive search query for course code
      const searchQuery = `%${course_code}%`;
      console.log('here is searchQuery:', searchQuery);

      // Build the OR filter for Supabase query
      const filterString = [
        `course_code.ilike.${searchQuery}`
      ].join(',');

      // Query the 'courses' table using Supabase
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(filterString);

      if (data == null) {
        return [];
      }

      if (error) {
        console.log(error);
        console.error('Error fetching department:', error);
      }

      return data as Course[];
    } else {
      return [];
    }
  }
}

// Export a shared instance of DepartmentService
export var DeptObj = new DepartmentService();

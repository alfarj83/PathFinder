// services/departments.ts
import { Course, Department } from '@/types';
import { APIObj } from '@/services/api';
import { supabase } from '@/utils/supabase';
import { Professor } from '@/types';

class DepartmentService {
  // returns a list of all department professors
  async getDeptList(): Promise<Department[]> {
    if (supabase) {
      const { data } = await supabase
        .from('dept_list')
        .select()

      return data as Department[];
    } else {
      console.log('Department data was not collected')
      return [];
    }
  };

  async getDepartmentByCode(code: string): Promise<Department | null> {
    return APIObj.get<Department>(`/departments/${code}`);
  };

  // filters by dept_name in professors table
  async getDeptProfessors(dept_name: string): Promise<Professor[]> {
    //const query = `/professors?department_name=${dept_name}`; 
    if (supabase) {
      // 2. Prepare the search term for a 'contains' query (ilike = case-insensitive)
      const searchQuery = `%${dept_name}%`;
      console.log('here is searchQuery:', searchQuery) // gets to here

      // 3. Build the .or() filter string. This searches for the query in any of the specified columns.
      // Note: Adjust this if your column names are different!
      const filterString = [
        `department_name.ilike.${searchQuery}`
      ].join(','); // .or() takes a comma-separated string

        // 4. Await the database query
        const { data, error } = await supabase
          .from('professors') // Make sure 'professors' is your table name
          .select('*')            // Get all columns
          .ilike('department_name', searchQuery);
          
        if (data == null) {
          return [];
        }
        
        if (error) {
          console.log(error)
          console.error('Error fetching department:', error);
        }
  
        return data as Professor[];
      } else {
        return [];
      }
  }

  async getDeptCourses(course_code: string): Promise<Course[]> {
    if (supabase) {
      // 2. Prepare the search term for a 'contains' query (ilike = case-insensitive)
      const searchQuery = `%${course_code}%`;
      console.log('here is searchQuery:', searchQuery) // gets to here

      // 3. Build the .or() filter string. This searches for the query in any of the specified columns.
      // Note: Adjust this if your column names are different!
      const filterString = [
        `course_code.ilike.${searchQuery}`
      ].join(','); // .or() takes a comma-separated string

        // 4. Await the database query
        const { data, error } = await supabase
          .from('courses') // Make sure 'courses' is your table name
          .select('*')            // Get all columns
          .or(filterString);   // Apply the multi-column search

          
      if (data == null) {
        return [];
      }
      
      if (error) {
        console.log(error)
        console.error('Error fetching department:', error);
      }

      return data as Course[];
    } else {
      return [];
    }
  }
};

export var DeptObj = new DepartmentService();
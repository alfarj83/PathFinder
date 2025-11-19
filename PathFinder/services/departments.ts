// services/departments.ts
import { Department } from '@/types';
import { mockDepartments } from '@/utils/mockData';
import { APIObj } from '@/services/api';
import { supabase } from '@/utils/supabase';
import { Professor } from '@/types';

class DepartmentService {
  // returns a list of all department professors
  getDeptList(): Department[] {
    return mockDepartments;
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
      console.log(searchQuery) // gets to here

      // 3. Build the .or() filter string. This searches for the query in any of the specified columns.
      // Note: Adjust this if your column names are different!
      const filterString = [
        `department_name.ilike.${searchQuery}`
      ].join(','); // .or() takes a comma-separated string

        // 4. Await the database query
        const { data, error } = await supabase
          .from('professors') // Make sure 'professors' is your table name
          .select()            // Get all columns
          .or(filterString);   // Apply the multi-column search
  
        if (error) {
          console.log(error)
          console.error('Error fetching department:', error);
        }
  
        return data as Professor[];
      } else {
        return [];
      }
  }
};

export var DeptObj = new DepartmentService();
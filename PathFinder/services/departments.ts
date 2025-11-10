// services/departments.ts
import { Department } from '@/types';
import { mockDepartments } from '@/utils/mockData';
import { api } from '@/services/api';
import { supabase } from '@/utils/supabase';
import { Professor } from '@/types';

const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? "true") === "true";

class DepartmentService {
  // returns a list of all departments
  async getDeptList(): Promise<Department[]> {
    if (USE_MOCK) return mockDepartments;
    return api.get<Department[]>('/departments');
  };

  async getDepartmentByCode(code: string): Promise<Department | null> {
    if (USE_MOCK) return mockDepartments.find(d => d.code === code) ?? null;
    return api.get<Department>(`/departments/${code}`);
  };

  async getMatchingProfessors(search_query:string): Promise<Professor[]> {
    let matchingProfs: Professor[] = [];
    
    if (supabase) {
      // 4. Await the database query
      const { data, error } = await supabase
        .from('professors') // Make sure 'professors' is your table name
        .select()            // Get all columns
        .or(search_query);   // Apply the multi-column search

      if (error) {
        console.error('Error searching professors:', error);
        return []; // On error, return an empty array
      }

      matchingProfs = data;
    }
    return matchingProfs;
  }
};

export var DeptObj = new DepartmentService();
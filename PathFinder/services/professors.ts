// services/professors.ts
import { Professor } from '@/types';
import { mockProfessors } from '@/utils/mockData';
import { api } from '@/services/api';
import { supabase } from '@/utils/supabase';
const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? "true") === "true";

export const professorService = {
  getAllProfessors: () => USE_MOCK
    ? Promise.resolve(mockProfessors)
    : api.get<Professor[]>('/professors'),

  getProfessorsByDepartment: (departmentCode: string) => USE_MOCK
    ? Promise.resolve(mockProfessors.filter(p => p.departmentCode === departmentCode))
    : api.get<Professor[]>('/professors', { department: departmentCode }),

    // 1. Make the function async so you can use 'await'
  searchProfessors: async (q: string): Promise<Professor[]> => {
    
    // The 'supabase' variable is the Supabase client
    if (supabase) {
      
      // 2. Prepare the search term for a 'contains' query (ilike = case-insensitive)
      const searchQuery = `%${q}%`;

      // 3. Build the .or() filter string. This searches for the query in any of the specified columns.
      // Note: Adjust this if your column names are different!
      const filterString = [
        `full_name.ilike.${searchQuery}`,
        `first_name.ilike.${searchQuery}`,
        `last_name.ilike.${searchQuery}`,
        `department_name.ilike.${searchQuery}`
      ].join(','); // .or() takes a comma-separated string

      // 4. Await the database query
      const { data, error } = await supabase
        .from('professors') // Make sure 'professors' is your table name
        .select()            // Get all columns
        .or(filterString);   // Apply the multi-column search

      if (error) {
        console.error('Error searching professors:', error);
        return []; // On error, return an empty array
      }

      // 5. Return the data from the database
      return data || []; // Return data, or an empty array if data is null
    
    } else {
      // Your fallback API call was correct
      return api.get<Professor[]>('/professors/search', { q });
    }
  }
};

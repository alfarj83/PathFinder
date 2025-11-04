// services/professors.ts
import { Professor } from '@/types';
import { mockProfessors } from '@/utils/mockData';
import { api } from '@/services/api';
const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? "true") === "true";

export const professorService = {
  getAllProfessors: () => USE_MOCK
    ? Promise.resolve(mockProfessors)
    : api.get<Professor[]>('/professors'),

  getProfessorsByDepartment: (departmentCode: string) => USE_MOCK
    ? Promise.resolve(mockProfessors.filter(p => p.departmentCode === departmentCode))
    : api.get<Professor[]>('/professors', { department: departmentCode }),

  searchProfessors: (q: string) => USE_MOCK
    ? Promise.resolve(
        mockProfessors.filter(p =>
          [p.name, p.firstName, p.lastName, p.department].some(x =>
            x.toLowerCase().includes(q.toLowerCase())
          )
        )
      )
    : api.get<Professor[]>('/professors/search', { q }),
};

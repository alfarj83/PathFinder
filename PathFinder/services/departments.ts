// services/departments.ts
import { Department } from '@/types';
import { mockDepartments } from '@/utils/mockData';
import { api } from '@/services/api';

const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? "true") === "true";

export const departmentService = {
  async getAllDepartments(): Promise<Department[]> {
    if (USE_MOCK) return mockDepartments;
    return api.get<Department[]>('/departments');
  },

  async getDepartmentByCode(code: string): Promise<Department | null> {
    if (USE_MOCK) return mockDepartments.find(d => d.code === code) ?? null;
    return api.get<Department>(`/departments/${code}`);
  },
};

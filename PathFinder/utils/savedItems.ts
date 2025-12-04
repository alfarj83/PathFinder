import { supabase } from '@/utils/supabase';

/**
 * Check if a professor is saved by the current user
 */
export async function isProfessorSaved(professorId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('saved_professors')
      .select('id')
      .eq('user_id', user.id)
      .eq('professor_id', professorId)
      .single();

    return !!data && !error;
  } catch {
    return false;
  }
}

/**
 * Save a professor for the current user
 */
export async function saveProfessor(professorId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('saved_professors')
      .insert({
        user_id: user.id,
        professor_id: professorId,
      });

    return !error;
  } catch (error) {
    console.error('Error saving professor:', error);
    return false;
  }
}

/**
 * Unsave a professor for the current user
 */
export async function unsaveProfessor(professorId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('saved_professors')
      .delete()
      .eq('user_id', user.id)
      .eq('professor_id', professorId);

    return !error;
  } catch (error) {
    console.error('Error unsaving professor:', error);
    return false;
  }
}

/**
 * Toggle saved status for a professor
 */
export async function toggleSaveProfessor(professorId: string): Promise<boolean> {
  const isSaved = await isProfessorSaved(professorId);
  
  if (isSaved) {
    return await unsaveProfessor(professorId);
  } else {
    return await saveProfessor(professorId);
  }
}

/**
 * Check if a course is saved by the current user
 */
export async function isCourseSaved(courseId: string | number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('saved_courses')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    return !!data && !error;
  } catch {
    return false;
  }
}

/**
 * Save a course for the current user
 */
export async function saveCourse(courseId: string | number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('saved_courses')
      .insert({
        user_id: user.id,
        course_id: courseId,
      });

    return !error;
  } catch (error) {
    console.error('Error saving course:', error);
    return false;
  }
}

/**
 * Unsave a course for the current user
 */
export async function unsaveCourse(courseId: string | number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('saved_courses')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    return !error;
  } catch (error) {
    console.error('Error unsaving course:', error);
    return false;
  }
}

/**
 * Toggle saved status for a course
 */
export async function toggleSaveCourse(courseId: string | number): Promise<boolean> {
  const isSaved = await isCourseSaved(courseId);
  
  if (isSaved) {
    return await unsaveCourse(courseId);
  } else {
    return await saveCourse(courseId);
  }
}
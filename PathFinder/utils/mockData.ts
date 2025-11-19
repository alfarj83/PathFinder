import { Department, Professor, Course } from '@/types';

export const mockDepartments: Department[] = [
  // Humanities
  { id: '1', category: 'Humanities, Arts and Social Sciences', code: 'ARTS', name: 'Arts', fullName: 'Arts Department' },
  { id: '2', category: 'Humanities, Arts and Social Sciences', code: 'COGS', name: 'Cognitive Science', fullName: 'Cognitive Science Department' },
  { id: '3', category: 'Humanities, Arts and Social Sciences', code: 'COMM', name: 'Communication', fullName: 'Communication & Media Department' },
  { id: '4', category: 'Humanities, Arts and Social Sciences', code: 'ECON', name: 'Economics', fullName: 'Economics Department' },
  { id: '5', category: 'Humanities, Arts and Social Sciences', code: 'GSAS', name: 'Games and Simulation Arts and Sciences', fullName: 'Games and Simulation Arts and Sciences Department' },
  { id: '6', category: 'Humanities, Arts and Social Sciences', code: 'IHSS', name: 'Interdisciplinary Humanities and Social Sciences', fullName: 'Interdisciplinary Humanities and Social Sciences Department' },
  { id: '7', category: 'Humanities, Arts and Social Sciences', code: 'INQR', name: 'HASS Inquiry', fullName: 'HASS Inquiry Department' },
  { id: '8', category: 'Humanities, Arts and Social Sciences', code: 'LANG', name: 'Foreign Languages', fullName: 'Foreign Languages Department' },
  { id: '9', category: 'Humanities, Arts and Social Sciences', code: 'LITR', name: 'Literature', fullName: 'Literature Department' },
  { id: '10', category: 'Humanities, Arts and Social Sciences', code: 'PHIL', name: 'Philosophy', fullName: 'Philosophy Department' },
  { id: '11', category: 'Humanities, Arts and Social Sciences', code: 'PSYC', name: 'Psychology', fullName: 'Psychology Department' },
  { id: '12', category: 'Humanities, Arts and Social Sciences', code: 'STSO', name: 'Science, Technology, and Society', fullName: 'Science, Technology, and Society Department' },
  { id: '13', category: 'Humanities, Arts and Social Sciences', code: 'WRIT', name: 'Writing', fullName: 'Writing Department' },
  
  // Management
  { id: '14', category: 'Management', code: 'BUSN', name: 'Business (H)', fullName: 'Business (H) Department' },
  { id: '15', category: 'Management', code: 'MGMT', name: 'Management', fullName: 'Management Department' },

  // Architecture
  { id: '16', category: 'Architecture', code: 'ARCH', name: 'Architecture', fullName: 'Architecture Department' },
  { id: '17', category: 'Architecture', code: 'LGHT', name: 'Lighting', fullName: 'Lighting Department' },

  // Engineering
  { id: '18', category: 'Engineering', code: 'BMED', name: 'Biomedical Engineering', fullName: 'Biomedical Engineering Department' },
  { id: '19', category: 'Engineering', code: 'CHME', name: 'Chemical Engineering', fullName: 'Chemical Engineering Department' },
  { id: '20', category: 'Engineering', code: 'CIVL', name: 'Civil Engineering', fullName: 'Civil Engineering Department' },
  { id: '21', category: 'Engineering', code: 'ECSE', name: 'Electrical, Computer, and Systems Engineering', fullName: 'Electrical, Computer, and Systems Engineering Department' },
  { id: '22', category: 'Engineering', code: 'ENGR', name: 'General Engineering', fullName: 'General Engineering Department' },
  { id: '23', category: 'Engineering', code: 'ENVE', name: 'Environmental Engineering', fullName: 'Environmental Engineering Department' },
  { id: '24', category: 'Engineering', code: 'ESCI', name: 'Engineering Science', fullName: 'Engineering Science Department' },
  { id: '25', category: 'Engineering', code: 'ISYE', name: 'Industrial and Systems Engineering', fullName: 'Industrial and Systems Engineering Department' },
  { id: '26', category: 'Engineering', code: 'MANE', name: 'Mechanical, Aerospace, and Nuclear Engineering', fullName: 'Mechanical, Aerospace, and Nuclear Engineering Department' },
  { id: '27', category: 'Engineering', code: 'MTLE', name: 'Materials Science and Engineering', fullName: 'Materials Science and Engineering Department' },

  // Information Technology and Web Science
  { id: '28', category: 'Management', code: 'ITWS', name: 'Information Technology and Web Science', fullName: 'Information Technology and Web Science Department' },

  // Science
  { id: '29', category: 'Science', code: 'ASTR', name: 'Astronomy', fullName: 'Astronomy Department' },
  { id: '30', category: 'Science', code: 'BCBP', name: 'Biochemistry and Biophysics', fullName: 'Biochemistry and Biophysics Department' },
  { id: '31', category: 'Science', code: 'BIOL', name: 'Biology', fullName: 'Biology Department' },
  { id: '32', category: 'Science', code: 'CHEM', name: 'Chemistry', fullName: 'Chemistry Department' },
  { id: '33', category: 'Science', code: 'CSCI', name: 'Computer Science', fullName: 'Computer Science Department' },
  { id: '34', category: 'Science', code: 'ERTH', name: 'Earth and Environmental Science', fullName: 'Earth and Environmental Science Department' },
  { id: '35', category: 'Science', code: 'ISCI', name: 'Interdisciplinary Science', fullName: 'Interdisciplinary Science Department' },
  { id: '36', category: 'Science', code: 'MATH', name: 'Mathematics', fullName: 'Mathematics Department' },
  { id: '37', category: 'Science', code: 'MATP', name: 'Mathematical Programming, Probability, and Statistics', fullName: 'Mathematical Programming, Probability, and Statistics Department' },
  { id: '38', category: 'Science', code: 'PHYS', name: 'Physics', fullName: 'Physics Department' }
];

// export const mockProfessors: Professor[] = [
//   {
//     id: '1',
//     name: 'Barbara Cutler',
//     firstName: 'Barbara',
//     lastName: 'Cutler',
//     department: 'Computer Science',
//     departmentCode: 'CSCI',
//     rating: 3.3,
//     difficulty: 3.0,
//     wouldTakeAgain: 65,
//     numRatings: 45,
//     email: 'cutler@cs.rpi.edu',
//     officeLocation: 'Lally 305',
//   },
//   {
//     id: '2',
//     name: 'John Smith',
//     firstName: 'John',
//     lastName: 'Smith',
//     department: 'Communication',
//     departmentCode: 'COMM',
//     rating: 4.2,
//     difficulty: 2.5,
//     wouldTakeAgain: 85,
//     numRatings: 30,
//     email: 'smithj@rpi.edu',
//     officeLocation: 'Lally 305',
//   },
//   {
//     id: '3',
//     name: 'Jane Doe',
//     firstName: 'Jane',
//     lastName: 'Doe',
//     department: 'Arts',
//     departmentCode: 'ARTS',
//     rating: 4.5,
//     difficulty: 2.0,
//     wouldTakeAgain: 90,
//     numRatings: 25,
//     email: 'doej@rpi.edu',
//     officeLocation: 'Lally 305',
//   },
//   // Add more mock professors as needed
// ];

// export const mockCourses: Course[] = [
//   {
//     id: '1',
//     code: 'CSCI 1100',
//     name: 'Computer Science I',
//     department: 'Computer Science',
//     departmentCode: 'CSCI',
//     description: 'Introduction to computer programming and problem solving',
//     credits: 4,
//     difficulty: 3.2,
//     prerequisites: [],
//     professors: ['Barbara Cutler'],
//   },
//   {
//     id: '2',
//     code: 'COMM 2400',
//     name: 'Media Studies',
//     department: 'Communication',
//     departmentCode: 'COMM',
//     description: 'Introduction to media theory and analysis',
//     credits: 3,
//     difficulty: 2.5,
//     prerequisites: [],
//     professors: ['John Smith'],
//   },
//   {
//     id: '3',
//     code: 'ARTS 1010',
//     name: 'Introduction to Studio Arts',
//     department: 'Arts',
//     departmentCode: 'ARTS',
//     description: 'Fundamentals of visual arts and design',
//     credits: 3,
//     difficulty: 2.0,
//     prerequisites: [],
//     professors: ['Jane Doe'],
//   },
//   // Add more mock courses as needed
// ];
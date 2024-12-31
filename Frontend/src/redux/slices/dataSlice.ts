import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Assessment, Course, Term } from '@/types/mainTypes';

interface DataState {
  data: Term[];
}

const initialState: DataState = {
    data: [
        {
          term: 'Fall 2023',
          courses: [
            {
              courseTitle: 'CFM 101',
              courseSubtitle: 'Introduction to Financial Data Analytics',
              colour: 'blue',
              highestGrade: 40,
              gradingSchemes: [
                {
                  schemeName: 'Grading Scheme 1',
                  grade: 30,
                  assessments: [
                    { assessmentName: 'Assignment 1', weight: 5, dueDate: new Date('2024-09-06T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Midterm Exam', weight: 30, dueDate: new Date('2024-10-25T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Final Exam', weight: 35, dueDate: null, grade: 30 },
                    { assessmentName: 'Assignment 2', weight: 10, dueDate: new Date('2024-09-20T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Project 1', weight: 20, dueDate: new Date('2024-10-09T00:00:00+00:00').toISOString(), grade: 30 }
                  ]
                },
                {
                  schemeName: 'Grading Scheme 2',
                  grade: 40,
                  assessments: [
                    { assessmentName: 'Homework 1', weight: 10, dueDate: new Date('2024-09-10T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Midterm Exam', weight: 30, dueDate: new Date('2024-10-05T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Final Exam', weight: 50, dueDate: null, grade: 30 },
                    { assessmentName: 'Quiz 1', weight: 10, dueDate: new Date('2024-09-25T00:00:00+00:00').toISOString(), grade: 30 }
                  ]
                }
              ]
            },
            {
              courseTitle: 'MATH 135',
              courseSubtitle: 'Algebra',
              colour: 'green',
              highestGrade: 80,
              gradingSchemes: [
                {
                  schemeName: 'Grading Scheme A',
                  grade: 60,
                  assessments: [
                    { assessmentName: 'Project 1', weight: 20, dueDate: new Date('2024-09-20T11:59:00+00:00').toISOString(), grade: 60 },
                    { assessmentName: 'Quiz 1', weight: 10, dueDate: new Date('2024-09-25T00:00:00+00:00').toISOString(), grade: 60 },
                    { assessmentName: 'Final Exam', weight: 40, dueDate: null, grade: 60 },
                    { assessmentName: 'Assignment 1', weight: 15, dueDate: new Date('2024-10-01T00:00:00+00:00').toISOString(), grade: 60 },
                    { assessmentName: 'Assignment 2', weight: 15, dueDate: new Date('2024-10-10T23:59:00.000').toISOString(), grade: 60 }
                  ]
                }
              ]
            },
          ]
        },
        {
          term: 'Winter 2025',
          courses: [
            {
              courseTitle: 'CFM 102',
              courseSubtitle: 'Introduction to Financial Data Analytics',
              colour: 'purple',
              highestGrade: 40,
              gradingSchemes: [
                {
                  schemeName: 'Grading Scheme 1',
                  grade: 30,
                  assessments: [
                    { assessmentName: 'Assignment 1', weight: 5, dueDate: new Date('2024-09-06T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Midterm Exam', weight: 30, dueDate: new Date('2024-10-25T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Final Exam', weight: 35, dueDate: null, grade: 30 },
                    { assessmentName: 'Assignment 2', weight: 10, dueDate: new Date('2024-09-20T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Project 1', weight: 20, dueDate: new Date('2024-10-09T00:00:00+00:00').toISOString(), grade: 30 }
                  ]
                },
                {
                  schemeName: 'Grading Scheme 2',
                  grade: 40,
                  assessments: [
                    { assessmentName: 'Homework 1', weight: 10, dueDate: new Date('2024-09-10T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Midterm Exam', weight: 30, dueDate: new Date('2024-10-05T00:00:00+00:00').toISOString(), grade: 30 },
                    { assessmentName: 'Final Exam', weight: 50, dueDate: null, grade: 30 },
                    { assessmentName: 'Quiz 1', weight: 10, dueDate: new Date('2024-09-25T00:00:00+00:00').toISOString(), grade: 30 }
                  ]
                }
              ]
            },
            {
              courseTitle: 'MATH 136',
              courseSubtitle: 'Algebra',
              colour: 'pink',
              highestGrade: 80,
              gradingSchemes: [
                {
                  schemeName: 'Grading Scheme A',
                  grade: 60,
                  assessments: [
                    { assessmentName: 'Project 1', weight: 20, dueDate: new Date('2024-09-20T11:59:00+00:00').toISOString(), grade: 60 },
                    { assessmentName: 'Quiz 1', weight: 10, dueDate: new Date('2024-09-25T00:00:00+00:00').toISOString(), grade: 60 },
                    { assessmentName: 'Final Exam', weight: 40, dueDate: null, grade: 60 },
                    { assessmentName: 'Assignment 1', weight: 15, dueDate: new Date('2024-10-01T00:00:00+00:00').toISOString(), grade: 60 },
                    { assessmentName: 'Assignment 2', weight: 15, dueDate: new Date('2024-10-10T23:59:00.000').toISOString(), grade: 60 }
                  ]
                }
              ]
            },
          ]
        },
      ], // Initial data can be set here
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<Term[]>) {
            state.data = action.payload;
        },
        updateTerm(state, action: PayloadAction<{ term: string; courses: Course[] }>) {
            const { term, courses } = action.payload;
            const termIndex = state.data.findIndex((t) => t.term === term);
            if (termIndex !== -1) {
              state.data[termIndex].courses = courses;
            }
        },
        updateCourseName(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
            const { term, courseIndex, course } = action.payload;
            const termIndex = state.data.findIndex((t) => t.term === term);
            if (termIndex !== -1) {
                const repeatedCourseTitle = state.data[termIndex].courses.find(
                  (c) => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase()
                )
                if  (repeatedCourseTitle) {
                  return;
                }
                state.data[termIndex].courses[courseIndex] = course;
            }
        },
        updateCourse(state, action: PayloadAction<{ term: string; courseIndex: number; course: Course }>) {
          const { term, courseIndex, course } = action.payload;
          const termIndex = state.data.findIndex((t) => t.term === term);
          if (termIndex !== -1) {
              state.data[termIndex].courses[courseIndex] = course;
          }
        },
        addCourse(state, action: PayloadAction<{ term: string; course: Course }>) {
          const { term, course } = action.payload;
          const termIndex = state.data.findIndex((t) => t.term === term);
      
          if (termIndex !== -1) {
              const existingCourse = state.data[termIndex].courses.find(
                  (c) => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase() // Case insensitive comparison
              );
              
              if (existingCourse) {
                  // console.log("Course already exists!");
                  return;  // Don't add the new course if it already exists
              }
      
              state.data[termIndex].courses.push(course);  // Add the new course if it doesn't exist
          }
        },
        deleteCourse(state, action: PayloadAction<{ term: string; courseIndex: number }>) {
            const { term, courseIndex } = action.payload;
            const termIndex = state.data.findIndex((t) => t.term === term);
            if (termIndex !== -1) {
                state.data[termIndex].courses.splice(courseIndex, 1);
            }
        },
        updateAssessment(state, action: PayloadAction<{ term: string; courseIndex: number; schemeIndex: number; assessmentIndex: number; assessment: Assessment }>) {
            const { term, courseIndex, schemeIndex, assessmentIndex, assessment } = action.payload;
            const termIndex = state.data.findIndex((t) => t.term === term);
            if (termIndex !== -1) {
                state.data[termIndex].courses[courseIndex].gradingSchemes[schemeIndex].assessments[assessmentIndex] = assessment;
            }
        },
    },
});

export const { setData, updateCourse, addCourse, deleteCourse, updateAssessment, updateTerm, updateCourseName } = dataSlice.actions;

export default dataSlice.reducer;

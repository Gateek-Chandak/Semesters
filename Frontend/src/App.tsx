import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from "@/components/ui/toaster";

import LandingPage from './Pages/LandingPages/Landing';
import HomePage from './Pages/HomePages/HomePage';
import CoursePage from './Pages/HomePages/CoursePage';
import Dashboard from './components/Dashboard';
import TermPage from './Pages/HomePages/TermPage';

function App() {

  const data = [
    {
      term: 'Fall 2023',
      courses: [
        {
          courseTitle: 'CFM 101',
          courseSubtitle: 'Introduction to Financial Data Analytics',
          colour: 'blue',
          gradingSchemes: [
            {
              schemeName: 'Grading Scheme 1',
              grade: 30,
              assessments: [
                { assessmentName: 'Assignment 1', weight: 5, dueDate: '2024-09-06T00:00:00+00:00', grade: 30 },
                { assessmentName: 'Midterm Exam', weight: 30, dueDate: '2024-09-15T00:00:00+00:00', grade: 30 },
                { assessmentName: 'Final Exam', weight: 35, dueDate: '2024-10-15T00:00:00+00:00', grade: 30 },
                { assessmentName: 'Assignment 2', weight: 10, dueDate: '2024-09-20T00:00:00+00:00', grade: 30 },
                { assessmentName: 'Project 1', weight: 20, dueDate: '2024-10-01T00:00:00+00:00', grade: 30 }
              ]
            },
            {
              schemeName: 'Grading Scheme 2',
              grade: 40,
              assessments: [
                { assessmentName: 'Homework 1', weight: 10, dueDate: '2024-09-10T00:00:00+00:00', grade: 30 },
                { assessmentName: 'Midterm Exam', weight: 30, dueDate: '2024-10-05T00:00:00+00:00', grade: 30 },
                { assessmentName: 'Final Exam', weight: 50, dueDate: '2024-11-01T00:00:00+00:00', grade: 30 },
                { assessmentName: 'Quiz 1', weight: 10, dueDate: '2024-09-25T00:00:00+00:00', grade: 30 }
              ]
            }
          ]
        },
        {
          courseTitle: 'MATH 135',
          courseSubtitle: 'Algebra',
          colour: 'green',
          gradingSchemes: [
            {
              schemeName: 'Grading Scheme A',
              grade: 60,
              assessments: [
                { assessmentName: 'Project 1', weight: 20, dueDate: '2024-09-20T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Quiz 1', weight: 10, dueDate: '2024-09-25T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Final Exam', weight: 40, dueDate: '2024-10-15T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Assignment 1', weight: 15, dueDate: '2024-10-01T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Assignment 2', weight: 15, dueDate: '2024-10-10T00:00:00+00:00', grade: 60 }
              ]
            }
          ]
        },
        {
          courseTitle: 'CS 135',
          courseSubtitle: 'Intro To Computer Science',
          colour: 'purple',
          gradingSchemes: [
            {
              schemeName: 'Grading Scheme A',
              grade: 60,
              assessments: [
                { assessmentName: 'Project 1', weight: 20, dueDate: '2024-09-20T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Quiz 1', weight: 10, dueDate: '2024-09-25T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Final Exam', weight: 40, dueDate: '2024-10-15T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Assignment 1', weight: 15, dueDate: '2024-10-01T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Assignment 2', weight: 15, dueDate: '2024-10-10T00:00:00+00:00', grade: 60 }
              ]
            }
          ]
        },
        {
          courseTitle: 'GBDA 101',
          courseSubtitle: 'Design',
          colour: 'blue',
          gradingSchemes: [
            {
              schemeName: 'Grading Scheme A',
              grade: 60,
              assessments: [
                { assessmentName: 'Project 1', weight: 20, dueDate: '2024-09-20T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Quiz 1', weight: 10, dueDate: '2024-09-25T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Final Exam', weight: 40, dueDate: '2024-10-15T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Assignment 1', weight: 15, dueDate: '2024-10-01T00:00:00+00:00', grade: 60 },
                { assessmentName: 'Assignment 2', weight: 15, dueDate: '2024-10-10T00:00:00+00:00', grade: 60 }
              ]
            }
          ]
        },
        {
          courseTitle: 'MATH 137',
          courseSubtitle: 'Calculus I',
          colour: 'pink',
          gradingSchemes: [
            {
              schemeName: 'Standard Scheme',
              grade: 90,
              assessments: [
                { assessmentName: 'Homework', weight: 10, dueDate: '2024-09-06T00:00:00+00:00', grade: 90 },
                { assessmentName: 'Midterm Exam', weight: 30, dueDate: '2024-09-20T00:00:00+00:00', grade: 90 },
                { assessmentName: 'Final Exam', weight: 40, dueDate: '2024-10-05T00:00:00+00:00', grade: 90 },
                { assessmentName: 'Quiz 1', weight: 10, dueDate: '2024-09-25T00:00:00+00:00', grade: 90 }
              ]
            },
            {
              schemeName: 'Alternative Scheme',
              grade: 100,
              assessments: [
                { assessmentName: 'Assignment 1', weight: 20, dueDate: '2024-09-10T00:00:00+00:00', grade: 100 },
                { assessmentName: 'Quiz 1', weight: 20, dueDate: '2024-09-15T00:00:00+00:00', grade: 100 },
                { assessmentName: 'Midterm Exam', weight: 30, dueDate: '2024-09-25T00:00:00+00:00', grade: 100 },
                { assessmentName: 'Project', weight: 30, dueDate: '2024-10-01T00:00:00+00:00', grade: 100 }
              ]
            }
          ]
        }
      ]
    },
    {
      term: 'Winter 2024',
      courses: [
        {
          courseTitle: 'CS 136',
          courseSubtitle: 'Elementary Data Abstraction and Algorithm Design',
          colour: 'purple',
          gradingSchemes: [
            {
              schemeName: 'Primary Scheme',
              grade: 0,
              assessments: [
                { assessmentName: 'Assignment 1', weight: 10, dueDate: '2024-01-15T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Midterm Exam', weight: 30, dueDate: '2024-02-05T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Final Exam', weight: 50, dueDate: '2024-02-15T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Quiz 1', weight: 10, dueDate: '2024-01-25T00:00:00+00:00', grade: 0 }
              ]
            }
          ]
        },
        {
          courseTitle: 'MATH 136',
          courseSubtitle: 'Linear Algebra',
          colour: 'green',
          gradingSchemes: [
            {
              schemeName: 'Scheme B',
              grade: 0,
              assessments: [
                { assessmentName: 'Case Study', weight: 20, dueDate: '2024-01-20T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Quiz', weight: 10, dueDate: '2024-01-25T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Final Exam', weight: 50, dueDate: '2024-02-10T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Midterm Exam', weight: 20, dueDate: '2024-02-01T00:00:00+00:00', grade: 0 }
              ]
            }
          ]
        },
        {
          courseTitle: 'MATH 138',
          courseSubtitle: 'CALCULUS 2',
          colour: 'blue',
          gradingSchemes: [
            {
              schemeName: 'Main Scheme',
              grade: 0,
              assessments: [
                { assessmentName: 'Assignment 1', weight: 2, dueDate: '2024-01-20T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Assignment 2', weight: 2, dueDate: '2024-01-22T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Assignment 3', weight: 2, dueDate: '2024-01-23T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Assignment 4', weight: 2, dueDate: '2024-01-25T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Quiz', weight: 20, dueDate: '2024-01-28T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Final Exam', weight: 60, dueDate: '2024-02-05T00:00:00+00:00', grade: 0 },
                { assessmentName: 'Project', weight: 10, dueDate: '2024-01-30T00:00:00+00:00', grade: 0 }
              ]
            }
          ]
        }
      ]
    }
  ];
  
  

  return (
    <Router>
      <div className="h-full bg-[#f7f7f7]">
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Home route with nested routes */}
          <Route path="/home" element={<HomePage data={data} />}>
            {/* Nested route for dynamic courses */}
            <Route index element={<Dashboard />} />
            <Route path=":term/:course" element={<CoursePage data={data} />} />
            <Route path=":term" element={<TermPage data={data} />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

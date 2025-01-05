

export type IncomingAssessments = {
    assessmentName: string,
    weight: number,
    dueDate: Date | null
}

export type IncomingScheme = {
    schemeName: string,
    assessments: IncomingAssessments[]
}

export type IncomingCourseInfo = {
    gradingSchemes: IncomingScheme[]
}

export type CalendarEvent = {
  id: string;
  start: Date | null;
  end: Date | null;
  title: string;
  course: string;
  color?: 'green' | 'black' | 'blue' | 'pink' | 'purple' | 'orange' | 'red' 
};

export type Assessment = {
    assessmentName: string,
    dueDate: null | string,
    weight: number,
    grade: null | number
}

export type GradingScheme = {
    schemeName: string,
    grade: number,
    assessments: Assessment[]
}


export type Course = {
    courseTitle: string;
    courseSubtitle: string;
    colour: 'green' | 'black' | 'blue' | 'pink' | 'purple' | 'orange' | 'red' 
    highestGrade: number;
    gradingSchemes: GradingScheme[];
};

export type Term = {
    term: string;
    isCompleted: boolean;
    courses: Course[];
};
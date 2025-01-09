import { Link } from "react-router-dom";
import { Course } from "@/types/mainTypes";

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { Term } from "@/types/mainTypes";

interface DisplayTermCardProps {
  term: Term;
  isShowingGrades: boolean;
}

const DisplayTermCard: React.FC<DisplayTermCardProps> = ({ term, isShowingGrades }) => {
  const data = useSelector((state: RootState) => state.data.data)

  const termData = data.find((t) => t.term === term.term)
  const totalMarks = termData?.courses.reduce((total: number, course: Course) => {
    return total + course.highestGrade;
  }, 0)
  let termGPA = null
  if (totalMarks && term.courses.length >= 1) {
    termGPA = totalMarks / term.courses.length
  }

  return (
    <Link to={`/home/${term.term}`} >
        {!isShowingGrades &&
          <div className="border-2 border-slate-200 hover:border-slate-300 bg-card rounded-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm">
                  <div className="h-40 w-40 flex flex-col justify-center gap-1 items-center">
                      <h1 className='text-3xl'>{term.term.split(' ')[0]}</h1>
                      {term.term.split(' ').length > 1 && <h1 className='text-4xl font-medium'>‘{term.term.split(' ')[1].slice(-2)}</h1>}
                  </div>
          </div>}
        {isShowingGrades &&
          <div className="border-2 border-slate-200 bg-card rounded-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm">
                  <div className="h-40 w-40 flex flex-col justify-center gap-4 items-center">
                      <h1 className='text-2xl'>{term.term}</h1>
                      <h1 className='text-4xl font-medium'>{
                        //@ts-expect-error no clue
                        parseFloat(termGPA?.toFixed(2))
                        }%
                      </h1>
                  </div>
          </div>}
    </Link>
  );
};

export default DisplayTermCard;

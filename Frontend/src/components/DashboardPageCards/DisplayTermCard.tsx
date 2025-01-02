import { Link } from "react-router-dom";
import { Term } from "@/types/mainTypes";

interface DisplayTermCardProps {
  term: Term;
}

const DisplayTermCard: React.FC<DisplayTermCardProps> = ({ term }) => {
  return (
    <Link to={`/home/${term.term}`} >
        <div className="border-2 border-slate-200 bg-card rounded-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm">
                <div className="h-40 w-40 flex flex-col justify-center gap-1 items-center">
                    <h1 className='text-3xl'>{term.term.split(' ')[0]}</h1>
                    <h1 className='text-4xl font-medium'>‘{term.term.split(' ')[1].slice(-2)}</h1>
                </div>
        </div>
    </Link>
  );
};

export default DisplayTermCard;

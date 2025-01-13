import { Button } from '../ui/button';
import { Trash2Icon } from 'lucide-react';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setData } from '@/redux/slices/dataSlice';

import ConfirmDeletePopup from '../ConfirmDeletePopup';

import { Term } from "@/types/mainTypes";

interface EditTermCardProps {
  term: Term;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTermCard: React.FC<EditTermCardProps> = ({ term, isDeleting, setIsDeleting }) => {

    const dispatch = useDispatch()

    const data = useSelector((state: RootState) => state.data.data);

    const deleteTerm = () => {
        setIsDeleting(false)

        const remainingTerms = data.filter((t) => t.term !== term.term)

        dispatch(setData(remainingTerms))
    }

    return (
        <div>
            <div className="border-2 border-slate-200 bg-card rounded-2xl">
                <div className="h-40 w-40 flex flex-col justify-between gap-4 items-center py-8">
                    <h1 className='text-xl'>{term.term}</h1>
                    <Button variant="outline" className="h-10 border border-red-500 text-red-500 text-xs hover:bg-red-500 hover:text-white" onClick={() => setIsDeleting(!isDeleting)}>
                        Delete <Trash2Icon className="" />
                    </Button>
                </div>
            </div>
            <ConfirmDeletePopup name={term.term}
                                deleteItem={deleteTerm}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}/>
        </div>
    );
};

export default EditTermCard;

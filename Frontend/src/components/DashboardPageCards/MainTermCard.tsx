import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Trash2Icon, ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";
import { Term } from "@/types/mainTypes";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setData } from "@/redux/slices/dataSlice";

import ConfirmDeletePopup from "../ConfirmDeletePopup";

interface MainTermCardProps {
    name: string,
    isManagingCourses: boolean;
    term: Term;
    isShowingGrades: boolean;
    gpa: number;
    setIsDeletingTerm: React.Dispatch<React.SetStateAction<boolean>>;
    isDeletingTerm: boolean;
}

const MainTermCard: React.FC<MainTermCardProps> = ({
    name,
    isManagingCourses,
    term,
    isShowingGrades,
    gpa,
    setIsDeletingTerm,
    isDeletingTerm
}) => {

    const data = useSelector((state: RootState) => state.data.data);

    const dispatch = useDispatch()

    const deleteTerm = (name: string) => {
        const updatedTerms = data.filter((t) => t.term !== name)

        dispatch(setData(updatedTerms))
        setIsDeletingTerm(false)
    }

    return ( 
        <Card className={`p-5 px-7 h-[15rem] lg:h-full ${isManagingCourses ? '' : 'transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-slate-400 border'}`}>
            {!isManagingCourses &&
            <Link to={`/home/${term.term.replace(' ', '-')}`} className="h-full flex flex-col justify-between ">
                <div className="flex flex-row justify-between">
                    <h1>{name}</h1>
                </div>

                <div className="w-full flex flex-row justify-between">
                    <h1 className="text-4xl font-medium">{term.term}</h1>
                    {isShowingGrades && <h1 className="ml-0 text-4xl font-medium">{gpa}%</h1>}
                </div>
                <Separator />
                <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
            </Link>}
            {isManagingCourses &&
            <div className="h-full flex flex-col justify-between ">
                <div className="flex flex-row justify-between">
                    <h1>Current Term</h1>
                    {isManagingCourses && 
                    <Button variant="outline" className="ml-auto h-8 border border-red-500 text-red-500 text-xs hover:bg-red-500 hover:text-white" onClick={() => setIsDeletingTerm(!isDeletingTerm)}>
                        Delete <Trash2Icon className="" />
                    </Button>}
                </div>

                <div className="w-full flex flex-row justify-between">
                    <h1 className="text-4xl font-medium">{term.term}</h1>
                    {isShowingGrades && <h1 className="ml-0 text-4xl font-medium">{gpa}%</h1>}
                </div>
                <Separator />
                <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
            </div>}
            <ConfirmDeletePopup name={term.term}
                                deleteItem={deleteTerm}
                                isDeleting={isDeletingTerm}
                                setIsDeleting={setIsDeletingTerm}/>
        </Card>
     );
}
 
export default MainTermCard;
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";

interface ConfirmDeletePopupProps {
    name: string;
    isDeleting: boolean;
    setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
    deleteItem: (courseName: string) => void;
}

const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({
    name,
    isDeleting,
    setIsDeleting,
    deleteItem,
}) => {
    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isDeleting && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-2 text-xl">Delete {name}?</h1>
                            <button onClick={() => setIsDeleting(!isDeleting)}><XIcon className="ml-auto w-5 h-auto -top-3 left-1 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <p className="text-sm mb-3 font-extralight">Confirm Delete Below</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-7">
                            <Button variant={"destructive"} onClick={() => deleteItem(name)} className="w-full">Delete</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default ConfirmDeletePopup;
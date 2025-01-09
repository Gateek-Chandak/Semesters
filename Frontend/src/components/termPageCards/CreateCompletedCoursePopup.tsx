import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { ChangeEvent } from "react";

interface CreateCoursePopupProps {
    isUploading: boolean;
    isCreatingCourse: boolean;
    setIsCreatingCourse: React.Dispatch<React.SetStateAction<boolean>>;
    courseCode: string;
    setCourseCode: React.Dispatch<React.SetStateAction<string>>;
    courseNumber: string;
    setCourseNumber: React.Dispatch<React.SetStateAction<string>>;
    courseGrade: number;
    setCourseGrade: React.Dispatch<React.SetStateAction<number>>;
    createNewCourse: () => Promise<void>;
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>;
}
  
  const CreateCompletedCoursePopup: React.FC<CreateCoursePopupProps> = ({
        isUploading,
        isCreatingCourse,
        setIsCreatingCourse,
        courseCode,
        setCourseCode,
        courseNumber,
        setCourseNumber,
        createNewCourse,
        error,
        courseGrade,
        setCourseGrade,
        setError
    }) => {

    const manageCourseCode = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 6);
        setCourseCode(inputValue)
    }

    const manageCourseNumber = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 5);
        setCourseNumber(inputValue)
    };    

    const manageCourseGrade = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const parsedValue = parseInt(inputValue, 10);
    
        // Check if the parsed value is a number and within the range [0, 999]
        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 200) {
            setCourseGrade(parsedValue);
        } else if (inputValue === "") {
            // Allow clearing the input
            setCourseGrade(0);
        }
    }

    const handleClose = () => {
        setIsCreatingCourse(!isCreatingCourse)
        setError("")
        setCourseGrade(0)
        setCourseCode("")
        setCourseNumber("")
    }


    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isCreatingCourse && !isUploading && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-2 text-xl">Add Completed Course</h1>
                            <button onClick={handleClose}><XIcon className="ml-auto w-5 h-auto -top-4 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <p className="text-sm mb-5 font-extralight">Add a new completed course by entering its name and grade.</p>
                        <div className="flex flex-col gap-6 text-sm">
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Course Code *</h1>
                                <Input placeholder="CFM" value={courseCode} onChange={(e) => manageCourseCode(e)}></Input>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Course Number *</h1>
                                <Input placeholder="101" value={courseNumber} onChange={(e) => manageCourseNumber(e)}></Input>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Course Grade *</h1>
                                <Input placeholder="75" value={courseGrade} onChange={(e) => manageCourseGrade(e)}></Input>
                            </div>
                        </div>
                        <p className="text-left mt-6 text-red-600">{error}</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-10">
                            <Button onClick={() => createNewCourse()}>Add Course</Button>
                        </div>
                    </div>
                </div>
            }
            {isUploading && !isCreatingCourse && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
                        <h1 className="text-center font-bold text-2xl">Creating Your Class</h1>
                        <div className="flex flex-col justify-center items-center gap-4 py-10">
                            <p>this may take up to 15 seconds...</p>
                        </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default CreateCompletedCoursePopup;
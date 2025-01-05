import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

import ColourPicker from "./ColourPicker";

interface CreateCoursePopupProps {
    isUploading: boolean;
    isCreatingCourse: boolean;
    setIsCreatingCourse: React.Dispatch<React.SetStateAction<boolean>>;
    courseCode: string;
    setCourseCode: React.Dispatch<React.SetStateAction<string>>;
    courseNumber: number | null;
    setCourseNumber: React.Dispatch<React.SetStateAction<number | null>>;
    courseSubtitle: string;
    setCourseSubtitle: React.Dispatch<React.SetStateAction<string>>;
    createNewCourse: () => Promise<void>;
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>;
    setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
    selectedColour: string
    setSelectedColour: React.Dispatch<React.SetStateAction<string>>;
}
  
  const CreateCoursePopup: React.FC<CreateCoursePopupProps> = ({
        isUploading,
        isCreatingCourse,
        setIsCreatingCourse,
        courseCode,
        setCourseCode,
        courseNumber,
        setCourseNumber,
        courseSubtitle,
        setCourseSubtitle,
        createNewCourse,
        error,
        setError,
        setUploadedFile,
        selectedColour,
        setSelectedColour
    }) => {

    const manageCourseCode = (e: any) => {
        const inputValue = e.target.value.trimStart().slice(0, 7);
        setCourseCode(inputValue)
    }

    const manageCourseNumber = (e: any) => {
        const inputValue = e.target.value;
        const parsedValue = parseInt(inputValue, 10);
    
        // Check if the parsed value is a number and within the range [0, 999]
        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 9999) {
            setCourseNumber(parsedValue);
        } else if (inputValue === "") {
            // Allow clearing the input
            setCourseNumber(null);
        }
    };    

    const manageCourseSubtitle = (e: any) => {
        const inputValue = e.target.value.trimStart().slice(0, 30);
        setCourseSubtitle(inputValue)
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let file = null;
        if (event.target.files) {
            file = event.target.files[0];
        } else {
            file = null;
        }

        if (file) {
            setUploadedFile(file);
        }
    };

    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isCreatingCourse && !isUploading && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-2 text-xl">Add Course</h1>
                            <button onClick={() => setIsCreatingCourse(!isCreatingCourse)}><XIcon className="ml-auto w-5 h-auto -top-4 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <p className="text-sm mb-5 font-extralight">Add a new course by entering its name and uploading the syllabus. Although the upload is optional, we'll use this information to st up your calendar and grading system</p>
                        <div className="flex flex-col gap-6 text-sm">
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Course Code *</h1>
                                <Input placeholder="SYDE" value={courseCode} onChange={(e) => manageCourseCode(e)}></Input>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Course Number *</h1>
                                <Input placeholder="223" value={courseNumber !== null ? courseNumber : ""} onChange={(e) => manageCourseNumber(e)}></Input>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Course Name *</h1>
                                <Input placeholder="Data Structures & Algorithms" value={courseSubtitle} onChange={(e) => manageCourseSubtitle(e)}></Input>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Course Colour *</h1>
                                <ColourPicker selectedColour={selectedColour} setSelectedColour={setSelectedColour}/>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className="font-medium">Syllabus Upload</h1>
                                <Input
                                    type="file" // Accept only PDF files
                                    accept=".pdf"
                                    onChange={handleFileChange} // Handle file change
                                    className="hover:border-gray-200 hover:bg-gray-50 border-gray-100"
                                />
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
 
export default CreateCoursePopup;
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { XIcon } from "lucide-react";

import { useDispatch } from "react-redux";
import { updateCourse } from "@/redux/slices/dataSlice";

import { useState } from "react";

import { Course } from "@/types/mainTypes";

import { ChangeEvent } from "react";

interface AddSchemePopupProps {
    isAddingScheme: boolean;
    setIsAddingScheme: React.Dispatch<React.SetStateAction<boolean>>;
    term: string;
    courseIndex: number;
    courseData: Course;
}

const AddSchemePopup: React.FC<AddSchemePopupProps> = ( {isAddingScheme, setIsAddingScheme, term, courseIndex, courseData} ) => {

    const dispatch  = useDispatch()

    const [error, setError] = useState<string>('')

    const [name, setName] = useState<string>('')

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 25);
        setName(inputValue)
    }

    const handleSchemeAdd = () => {
        if (name.trim() === '' || name.length === 0) {
            setError('Name must have at least one character')
            return
        }

        const newScheme = {
            schemeName: name,
            grade: 0,
            assessments: []
        };

        const repeatedName = courseData?.gradingSchemes.find((s) =>
            s.schemeName === name
        );
        
        if (repeatedName) {
            setError('A scheme with this name already exists.')
            return;
        }
    
        dispatch(
            updateCourse({
                term: term,
                courseIndex: courseIndex,
                course: {
                    ...courseData,
                    gradingSchemes: [...courseData.gradingSchemes, newScheme],
                },
            })
        );
        setIsAddingScheme(false);
        setName('')
    };
    

    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isAddingScheme && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-10 text-xl">Add Scheme</h1>
                            <button onClick={() => setIsAddingScheme(false)}><XIcon className="ml-auto w-5 h-auto -top-8 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Name *</h1>
                                <Input placeholder="ex. Grading Scheme 1" value={name} onChange={handleNameChange}></Input>
                            </div>
                        </div>
                        <p className="text-left my-3 text-red-600">{error}</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-10">
                            <Button onClick={handleSchemeAdd}>+ Add Scheme</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default AddSchemePopup;
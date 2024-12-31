import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { XIcon } from "lucide-react";

import { useState } from "react";

interface AddDeliverablePopupProps {
    isAddingDeliverable: boolean;
    setIsAddingDeliverable: React.Dispatch<React.SetStateAction<boolean>>
}

const AddDeliverablePopup: React.FC<AddDeliverablePopupProps> = ( {isAddingDeliverable, setIsAddingDeliverable} ) => {

    const [error, setError] = useState<string>('')

    const [name, setName] = useState<string>('')
    const [weight, setWeight] = useState<number | null>(null)
    const [grade, setGrade] = useState<number | null>(null)
    const [date, setDate] = useState<string | null>(null)

    const handleCourseAdd = () => {
        setIsAddingDeliverable(false)
        console.log('hello')
    }

    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isAddingDeliverable && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-2 text-xl">Add Deliverable</h1>
                            <button onClick={() => setIsAddingDeliverable(false)}><XIcon className="ml-auto w-5 h-auto -top-4 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Name *</h1>
                                <Input placeholder="Quiz 1" value={name} onChange={(e) => setName(e.target.value)}></Input>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Weight*</h1>
                                <Input placeholder="10" value={weight || ''} onChange={(e) => setWeight(parseFloat(e.target.value))}></Input>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Grade</h1>
                                <Input placeholder="85" value={grade || ''} onChange={(e) => setGrade(parseFloat(e.target.value))}></Input>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Due Date</h1>
                                <Input placeholder="temp" value={date || ''} onChange={(e) => setWeight(parseFloat(e.target.value))}></Input>
                            </div>
                        </div>
                        <p className="text-left my-3 text-red-600">{error}</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-10">
                            <Button onClick={handleCourseAdd}>Add Course</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default AddDeliverablePopup;
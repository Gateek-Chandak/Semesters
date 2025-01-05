import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { XIcon } from "lucide-react";

import { useState } from "react";
import { ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import axios from "axios";
import { CalendarEvent } from "../Calendar";

interface ExportGoogleCalPopupProps {
    isExporting: boolean;
    setIsExporting: React.Dispatch<React.SetStateAction<boolean>>;
    calendarEvents: CalendarEvent[]
}

const ExportGoogleCalPopup: React.FC<ExportGoogleCalPopupProps> = ( {isExporting, setIsExporting, calendarEvents} ) => {
    const { toast } = useToast()

    let { term } = useParams()
    term = term?.replace('-', ' ')

    const [loading, setLoading] = useState<boolean>(false)
    const [calendarName, setCalendarName]= useState<string>(`Semester | ${term}`)
    const [error, setError]= useState<string>('')

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 30);
        setCalendarName(inputValue)
    }

    const handleClose = () => {
        setIsExporting(false)
        setCalendarName(`Semester | ${term}`)
    }

    const handleExport = async () => {
        if (calendarName.trim() === '') {
            setError('Name is required')
            return;
        }
        if (calendarEvents.length <= 0) {
            setError('Must have at least one event to export')
            return;
        }
        setIsExporting(false)
        setLoading(true)

        try {
            const response = await axios.get(`${import.meta.env.VITE_SITE_URL}/api/calendar/create-calendar`, {
                withCredentials: true, // Include cookies
                params: { calendarName: calendarName }, // Pass the calendar name
            });
            const { id } = response.data;
            console.log(calendarEvents)
            
            const eventsResponse = await axios.post(`${import.meta.env.VITE_SITE_URL}/api/calendar/create-events`, 
                {
                    events: calendarEvents // Send the events array directly as part of the request body
                },
                {
                    withCredentials: true, // Include cookies
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: { id: id }, // Pass the calendar ID as a query parameter
                }
            );
            console.log(eventsResponse.data)
            
            const data = response.data
            setError('')
            toast({
                variant: "success",
                title: "Calendar Export Successfull",
                description: "Your term calendar was successfully exported",
            });
            setIsExporting(false)
            setLoading(false)
            console.log('Calendar Created:', data);
        } catch (err) {
            //@ts-expect-error no clue
            console.error('Error:', err.response?.data || err.message);
            toast({
                variant: "destructive",
                title: "Calendar Export Unsuccessfull",
                description: "Your term calendar was not successfully exported",
            });
            setLoading(false)
            setIsExporting(true)
        }
    };    

    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isExporting && !loading && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-10 text-xl">Export to Google Calendar</h1>
                            <button onClick={handleClose}><XIcon className="ml-auto w-5 h-auto -top-8 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Name *</h1>
                                <Input placeholder="ex. Quiz 1" value={calendarName} onChange={handleNameChange}></Input>
                            </div>
                        </div>
                        <p className="text-left my-3 text-red-600">{error}</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-10">
                            <Button onClick={handleExport}>Export</Button>
                        </div>
                    </div>
                </div>
            }
            {loading && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 py-8 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-10 text-xl">Export to Google Calendar</h1>
                            <button onClick={handleClose}><XIcon className="ml-auto w-5 h-auto -top-8 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <h1 className="text-center">Exporting...</h1>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default ExportGoogleCalPopup;
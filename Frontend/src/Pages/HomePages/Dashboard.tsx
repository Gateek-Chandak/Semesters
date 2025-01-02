import { Card } from "../../components/ui/card";
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from "react-redux";
import { addTerm } from "@/redux/slices/dataSlice";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { Term } from "@/types/mainTypes";

import DisplayTermCard from "@/components/DashboardPageCards/DisplayTermCard";
import UploadTranscriptPopup from "@/components/DashboardPageCards/UploadTranscriptPopup";

const Dashboard = () => {
    const data = useSelector((state: RootState) => state.data.data);

    const { toast } = useToast()
    const dispatch = useDispatch()

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'EEEE, MMMM dd');

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (isUploading || isActive) {
        // Disable scrolling
        document.body.style.overflow = "hidden";
        } else {
        // Re-enable scrolling
        document.body.style.overflow = "";
        }
    
        // Cleanup on unmount
        return () => {
        document.body.style.overflow = "";
        };
    }, [isUploading, isActive]);

    const addTermsToData = (terms: Term[]) => {
        if (terms) {
            for (const term of terms) {  // use const or let here
                const repeatedCourse = data.find((t) => t.term === term.term)
                if (!repeatedCourse) {
                    dispatch(addTerm({ term }));
                }

            }
        }
    }

    const uploadTranscript = async () => {
        if (uploadedFile) {

            setIsActive(false)
            setIsUploading(true)

            const formData = new FormData();
            formData.append("pdf", uploadedFile);
    
            try {
                const response = await axios.post("http://localhost:4000/api/transcript/upload-transcript/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                const data = await response.data.result
                
                addTermsToData(data)

                setIsUploading(false)
                setIsActive(false)
                setUploadedFile(null)
                return;
            } catch (error: any) {
    
                setIsUploading(false);
                setIsActive(true);
    
                if (error.response.data.error === "no transcript found") {
                    toast({
                        variant: "destructive",
                        title: "Transcript Upload Unsuccessful",
                        description: "Your file is not a transcript",
                    });
                } else {
                    setError(error.response.data.error);
                }
                console.log(error);
            }
        } else {
            setError('Please upload a transcript')
        }
    }

    return ( 
        <div className="min-h-dvh bg-[#f7f7f7] flex flex-row justify-center">
            <div className="max-w-[1440px] flex flex-col gap-10 px-10 ">
                <div className="flex pt-10 flex-row gap-10">
                    <h1 className="text-[1.6rem] font-medium">Welcome, Gateek</h1>
                    <h1 className="text-[1.5rem] ml-auto font-light">Today is {formattedDate}</h1>
                </div>
                <div className="w-[100%] mt-2 flex flex-col lg:flex-row gap-10 h-fit lg:h-[24rem]">
                    <div className="lg:w-[60%] flex flex-col gap-10 h-[100%]">
                        <Card className="p-8 h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-slate-400 border">
                            <Link to={'/home/Winter-2025'} className="h-full flex flex-col justify-between ">
                                <h1>Current Term</h1>
                                <h1 className="text-4xl font-medium">Winter 2025</h1>
                                <Separator />
                                <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
                            </Link>
                        </Card>
                        <Card className="p-8 h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-slate-400 border">
                            <Link to={'/home/Fall-2024'} className="h-full flex flex-col justify-between ">
                                <h1>Current Term</h1>
                                <h1 className="text-4xl font-medium">Fall 2024</h1>
                                <Separator />
                                <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
                            </Link>
                        </Card>
                    </div>
                    <div className="lg:w-[40%] flex flex-col gap-10 h-[100%]">
                        <Card className="px-8 py-8 lg:py-0 h-full flex flex-row justify-center lg:justify-between items-center gap-10">
                            <h1 className="text-6xl font-semibold">9</h1>
                            <p className="font-light text-lg"><span className="font-bold">deliverables due this week.</span> Good luck! You may or may not be cooked...</p>
                        </Card>
                        <Card className="px-8 py-8 lg:py-0 h-full flex flex-col justify-center items-center gap-4">
                            <p className="font-light text-md"><span className="font-bold">Looks like we dont have your information for this term.</span> Upload your transcript to keep Semester up to date.</p>
                            <Button variant='outline' className="border-black h-10 justify-between items-center inline-flex w-full" onClick={() => setIsActive(!isActive)}>
                                <div className="text-black text-sm font-medium flex flex-row justify-between w-full">
                                    <h1>Upload Transcript</h1>
                                    <UploadIcon />
                                </div>
                            </Button>
                        </Card>
                    </div>
                </div>
                <Separator />
                <div className="h-96 flex flex-row w-full gap-10">
                    <div className="w-full flex flex-col gap-8"> 
                        <div className="flex flex-col gap-7 sm:gap-0 sm:flex-row w-ful pr-12">
                            <h1 className="sm:mr-auto text-xl font-light">Term Archive</h1>
                            <div className="sm:ml-auto flex flex-row gap-4">
                                <Button className='border border-black bg-white text-black hover:bg-gray-100' onClick={() => setIsActive(!isActive)}>
                                    <div className="text-black text-sm font-medium flex flex-row justify-between w-full gap-4">
                                        <h1>Upload Transcript</h1>
                                        <UploadIcon />
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-row gap-10">
                            {data.map((term) => {
                                return (<DisplayTermCard key={term.term} term={term}/>)
                            })}
                        </div>

                    </div>
                </div>
            </div>   
            <UploadTranscriptPopup isUploading={isUploading}
                                    isActive={isActive}
                                    setIsActive={setIsActive}
                                    uploadTranscript={uploadTranscript}
                                    error={error}
                                    setError={setError}
                                    setUploadedFile={setUploadedFile}/>    
        </div>
     );
}
 
export default Dashboard;
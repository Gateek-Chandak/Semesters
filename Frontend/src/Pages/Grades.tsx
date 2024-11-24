import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";

import GradeSchemeCard from "@/components/GradeSchemeCard";

// Individual Grade Scheme
interface GradingScheme {
    [name: string]: number;
  }

// Multiple Grade Schemes: Received from backend
interface GradeSchemes {
    [schemeName: string]: GradingScheme;
}


const GradesPage = () => {

    const [error, setError] = useState<string | null>("Select A File")
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [gradingSchemes, setGradeSchemes] = useState<GradeSchemes>({})

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {

        let file = null
        if (event.target.files){
            setError(null)
            file = event.target.files[0]
        } else {
            file = null
        }

        if (file) {
            setUploadedFile(file)
        }
    }

    const handleFileUpload = async (): Promise<void>  => {

        if (uploadedFile) {
            setIsUploading(true)
            const formData = new FormData();
            formData.append('pdf', uploadedFile);

            try {
                const response = await axios.post('http://127.0.0.1:8000/api/upload-pdf/', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })
                setIsUploading(false)
                setGradeSchemes(response.data)
                setError(null)
                console.log('File uploaded successfully:', response.data)

            } catch (error) {
            setError(`Error uploading file: ${error}`)
            }

        } else {
            setError('Please select a file first')
        }
    }

    return ( 
        <div className="px-20 py-5 flex flex-col gap-10 w-full h-screen">
            
            {error && <p className="w-full text-center">{error}</p>}

            <div className="flex gap-5 items-center">
                <Input type="file" accept=".pdf" onChange={handleFileChange} className="hover:border-gray-200 hover:bg-gray-50 border-gray-100"/>
                <Button onClick={handleFileUpload} className="w-2/12">Generate</Button>
            </div>


            {isUploading && 
                    <div className="flex justify-center gap-5 h-full">
                        <div className="w-4/5 border border-gray-100 px-7 pt-4 pb-6 rounded-3xl shadow-sm flex flex-col items-center justify-around" style={{ height: "35rem", overflowY: "auto" }}>
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="w-4/5 border border-gray-100 px-7 pt-4 pb-6 rounded-3xl shadow-sm flex flex-col items-center justify-around" style={{ height: "35rem", overflowY: "auto" }}>
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                }
            {!isUploading && 
                <div className="flex justify-center gap-5 h-full">
                    {Object.entries(gradingSchemes).map(([schemeName, schemeDetails]) => {
                        return (
                            <GradeSchemeCard schemeName={schemeName} schemeDetails={schemeDetails}/>
                        )
                    })}
                </div>
            }
        </div>
     );
}
 
export default GradesPage;
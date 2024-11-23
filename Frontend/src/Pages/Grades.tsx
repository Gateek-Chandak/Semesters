import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

    const [error, setError] = useState<string | null>("NO FILE SELECTED")

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
            setError("Uploading File")
            const formData = new FormData();
            formData.append('pdf', uploadedFile);

            try {
                const response = await axios.post('http://127.0.0.1:8000/api/upload-pdf/', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })
                setError(null)
                setGradeSchemes(response.data)
                console.log('File uploaded successfully:', response.data)

            } catch (error) {
            setError(`Error uploading file: ${error}`)
            }

        } else {
            setError('Please select a file first')
        }
    }

    return ( 
        <div className="mx-20 my-5 flex flex-col gap-10">
            
            {error && <p className="w-full text-center">{error}</p>}

            <div className="flex gap-5 items-center">
                <Input type="file" accept=".pdf" onChange={handleFileChange} className="hover:border-gray-200 border-gray-100"/>
                <Button onClick={handleFileUpload} className="w-2/12">Generate</Button>
            </div>

            <div className="flex justify-center gap-5 h-full">
                {Object.entries(gradingSchemes).map(([schemeName, schemeDetails]) => {
                    return (
                        <GradeSchemeCard schemeName={schemeName} schemeDetails={schemeDetails}/>
                    )
                })}
            </div>

        </div>
     );
}
 
export default GradesPage;
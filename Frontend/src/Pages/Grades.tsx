import { useState } from "react";
import axios from "axios";

interface GradingScheme {
    [name: string]: number;
  }

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
            setError(null)
            const formData = new FormData();
            formData.append('pdf', uploadedFile);

            try {
                const response = await axios.post('http://127.0.0.1:8000/api/upload-pdf/', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })


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
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>

            {error && <p>{error}</p>}

            {Object.entries(gradingSchemes).map(([schemeName, schemeDetails]) => {
                return (
                    <div key={schemeName} className="my-10">
                        <h1>{schemeName}</h1>
                        <div className="ml-10">
                            {Object.entries(schemeDetails).map(([assessmentName, weight]) => {
                                return (
                                    <h1>{assessmentName} : {weight}</h1>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

        </div>
     );
}
 
export default GradesPage;
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

interface UploadTranscriptPopupProps {
    isUploading: boolean;
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    uploadTranscript: () => Promise<void>;
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>;
    setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
}
  
  const UploadTranscriptPopup: React.FC<UploadTranscriptPopupProps> = ({
        isUploading,
        isActive,
        setIsActive,
        uploadTranscript,
        error,
        setError,
        setUploadedFile
    }) => {

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
            {isActive && !isUploading && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-2 text-xl">Upload Transcript</h1>
                            <button onClick={() => setIsActive(!isActive)}><XIcon className="ml-auto w-5 h-auto -top-4 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <p className="text-sm mb-5 font-extralight">By uploading your transcript, you'll be able to view all your terms, courses, and respective grades. Rest assured, duplicate terms will not be overwritten.</p>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">File</h1>
                                <Input
                                    type="file" // Accept only PDF files
                                    accept=".pdf"
                                    onChange={handleFileChange} // Handle file change
                                    className="hover:border-gray-200 hover:bg-gray-50 border-gray-100"
                                />
                            </div>
                        </div>
                        <p className="text-left my-3 text-red-600">{error}</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-10">
                            <Button onClick={() => uploadTranscript()}>Upload</Button>
                        </div>
                    </div>
                </div>
            }
            {isUploading && !isActive && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
                        <h1 className="text-center font-bold text-2xl">Reading Transcript</h1>
                        <div className="flex flex-col justify-center items-center gap-4 py-10">
                            <p>this may take up to 10 seconds...</p>
                        </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default UploadTranscriptPopup;
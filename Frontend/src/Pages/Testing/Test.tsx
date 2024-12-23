import { useState } from "react";
import axios from "axios";

// Importing necessary UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import GradeSchemeCard from "@/components/GradeSchemeCard";


// Interface to define the structure of an individual assessment
export interface Assessment {
  assessmentName: string; 
  weight: number; 
  due_date: string;
  grade: number; 
}

export interface GradingScheme {
  schemeName: string; 
  schemeGrade: number;
  schemeDetails: Assessment[]; 
}


type GradeSchemes = GradingScheme[];


// The main component for the Grades page
const TestPage = () => {
  // Toast hook for displaying success or error notifications
  const { toast } = useToast();

  // State hooks to manage file selection, uploading status, error messages, and grading schemes
  const [error, setError] = useState<string | null>("Select A File");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [gradingSchemes, setGradeSchemes] = useState<GradeSchemes>([]);


  // Handler for file input change (when the user selects a file)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let file = null;
    if (event.target.files) {
      // Reset any error when a file is selected
      setError(null);
      file = event.target.files[0];
    } else {
      file = null;
    }

    if (file) {
      // If a file is selected, set it in the state
      setUploadedFile(file);
    }
  };

  const formatGradingSchemes = (data: any) => {
    // Ensure grading_schemes is present and an array
    if (!data) {
      console.error("Invalid or missing grading_schemes:", data);
      return []; // Return an empty array if grading_schemes is missing or not an array
    }
  
    return data.gradingSchemes.map((scheme: any) => {
      if (!scheme.assessments || !Array.isArray(scheme.assessments)) {
        console.error("Invalid assessments array:", scheme);
        return {
          schemeName: scheme.schemeName,
          schemeGrade: 0,
          schemeDetails: [], // Return empty details if assessments are missing or invalid
        };
      }
  
      const schemeDetails: Assessment[] = scheme.assessments.map((assessment: any) => ({
        assessmentName: assessment.assessmentName,
        weight: assessment.weight,
        due_date: assessment.dueDate,
        grade: 0,  // Assuming initial grade is 0
      }));
  
      return {
        schemeName: scheme.schemeName,
        schemeGrade: 0, // Placeholder for the calculated grade
        schemeDetails: schemeDetails
      };
    });
  };
  

  // Function to handle file upload when the user clicks the "Generate" button
  const handleFileUpload = async (): Promise<void> => {
    if (uploadedFile) {
      // Start the uploading process
      setIsUploading(true);
      
      // Create FormData object to send the file as multipart form data
      const formData = new FormData();
      formData.append("pdf", uploadedFile);

      try {
        // Send the file to the backend API endpoint for processing
        const response = await axios.post("http://localhost:4000/api/pdf/upload-schedule/", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the right content type for file upload
          },
        });

        const data = await response.data
        //console.log(data)
        const json = await JSON.parse(data)
        console.log(json)
        // Handle the successful response
        setIsUploading(false); // Stop showing the "Uploading" status

        const formattedData = formatGradingSchemes(json);
        setGradeSchemes(formattedData);


        setError(null); 
        toast({
          variant: "success",
          title: "File Upload Successful",
          description: "Your file has been processed and the data has been uploaded.",
        });
      } catch (error: any) {
        setIsUploading(false); // Stop showing the "Uploading" status

        // if (error.response.data.error === "no grading scheme found") {
        //   setGradeSchemes([])
        //   setError("File not a syllabus")
        //   toast({
        //     variant: "destructive",
        //     title: "File Upload Unsuccessful",
        //     description: "Your file is not a syllabus",
        //   });
        // } else {
        //   setError(error.response.data.error); // Set the error message
        //   toast({
        //     variant: "destructive",
        //     title: "File Upload Error",
        //     description: "There was an error uploading your file. Please try again.",
        //   });
        // }

        console.log(error); // Log the error to the console
      }
    } else {
      // If no file is selected, show an error message
      setError("Please select a file first");
      toast({
        variant: "destructive",
        title: "File Upload Error",
        description: "Please select a file first.",
      });
    }
  };

  return (
    <div className="px-20 py-5 flex flex-col gap-10 w-full h-screen">
      {/* File input section */}
      <div className="flex gap-5 items-center">
        <Input
          type="file" // Accept only PDF files
          accept=".pdf"
          onChange={handleFileChange} // Handle file change
          className="hover:border-gray-200 hover:bg-gray-50 border-gray-100"
        />
        <Button onClick={handleFileUpload} className="w-2/12">Upload</Button> {/* Button to trigger file upload */}
      </div>


      {!isUploading && (
        <div className="flex justify-center gap-5 h-full">
          {/* Map over the grading schemes and render GradeSchemeCard for each */}
          {gradingSchemes.map((scheme) => {
            return (
              <GradeSchemeCard
                key={scheme.schemeName} // Use the scheme name as the key
                schemeName={scheme.schemeName} // Pass the scheme name as a prop
                schemeDetails={scheme.schemeDetails} // Pass the scheme details (assessments) as a prop
                schemeGrade={scheme.schemeGrade} // Pass the scheme grade as a prop
              />
            );
          })}
        </div>
      )}

    </div>
  );
};

export default TestPage;

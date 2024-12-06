import { useState } from "react";
import axios from "axios";

// Importing necessary UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Importing GradeSchemeCard component to display each grading scheme
import GradeSchemeCard from "@/components/GradeSchemeCard";

// Importing a custom toast hook to display notifications
import { useToast } from "@/hooks/use-toast";

// Interface to define the structure of an individual assessment
export interface Assessment {
  assessmentName: string; // The name of the assessment (e.g., "Midterm 1")
  weight: number; // The weight of the assessment (e.g., 20%)
  grade: number; // The grade for the assessment (null or undefined if not graded)
}

// Interface to define the structure of a grading scheme
export interface GradingScheme {
  schemeName: string; // The name of the grading scheme (e.g., "Grading Scheme 0")
  schemeGrade: number; // The overall grade associated with the grading scheme
  schemeDetails: Assessment[]; // Array of assessments within this grading scheme
}

// Type for an array of grading schemes
type GradeSchemes = GradingScheme[];

// Interface for the raw JSON data format received from the server
interface AssessmentJSON {
  [assessmentName: string]: number; // Assessment name as the key, weight as the value
}

// Interface for the overall structure of grading schemes in the raw JSON data
interface GradeSchemesJSON {
  [schemeName: string]: AssessmentJSON; // Scheme name as the key, assessment details as the value
}

// The main component for the Grades page
const GradesPage = () => {
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

  // Function to format the raw grading schemes data into the required structure
  const formatGradingSchemes = (gradingSchemes: GradeSchemesJSON): GradeSchemes => {
    // Converts the raw data into an array of GradingScheme objects
    const formatted = Object.entries(gradingSchemes).map(([schemeName, schemeDetails]) => ({
      schemeName: schemeName, // Assign the grading scheme name,
      schemeGrade: 0,
      schemeDetails: Object.entries(schemeDetails).map(([assessmentName, weight]) => ({
        assessmentName, // Assign the assessment name (e.g., "Midterm 1")
        weight, // Assign the weight of the assessment
        grade: 0
      })),
    }));
    
    // Log the formatted grading schemes to the console
    //console.log(formatted);
    return formatted;
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
        const response = await axios.post("http://localhost:4000/api/upload-pdf/", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the right content type for file upload
          },
        });

        // Handle the successful response
        setIsUploading(false); // Stop showing the "Uploading" status
        console.log(response); // Log the response from the server

        const formattedData = formatGradingSchemes(response.data);
        setGradeSchemes(formattedData);
        setError(null); 
        toast({
          variant: "success",
          title: "File Upload Successful",
          description: "Your file has been processed and the data has been uploaded.",
        });
      } catch (error: any) {
        setIsUploading(false); // Stop showing the "Uploading" status

        if (error.response.data.error === "no grading scheme found") {
          setGradeSchemes([])
          setError("File not a syllabus")
          toast({
            variant: "destructive",
            title: "File Upload Unsuccessful",
            description: "Your file is not a syllabus",
          });
        } else {
          setError(error.response.data.error); // Set the error message
          toast({
            variant: "destructive",
            title: "File Upload Error",
            description: "There was an error uploading your file. Please try again.",
          });
        }

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

      {/* Show skeleton loaders when uploading */}
      {isUploading && (
        <div className="flex justify-center gap-5 h-full">
          {/* Skeletons represent loading UI while waiting for response */}
          <div
            className="w-4/5 border border-gray-100 px-7 pt-4 pb-6 rounded-3xl shadow-sm flex flex-col items-center justify-around"
            style={{ height: "35rem", overflowY: "auto" }}
          >
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
      )}

      {/* Once uploading is finished, show the list of grading schemes */}
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

export default GradesPage;

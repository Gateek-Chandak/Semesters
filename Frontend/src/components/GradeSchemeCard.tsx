// React Imports

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Input } from "./ui/input";
import React, { ChangeEvent, useState } from "react";

// Interfaces
import { Assessment, GradingScheme } from "@/Pages/HomePages/Grades";

type GradeSchemeCardProps = {
    schemeName: string;
    schemeDetails: Assessment[];
    schemeGrade: number;
    key: string;
};

const GradeSchemeCard: React.FC<GradeSchemeCardProps> = ( {schemeName, schemeDetails, schemeGrade} ) => {

    const rowsPerPage = 100;
    const startIndex: number = 0

    const [localScheme, setLocalScheme] = useState<GradingScheme>({schemeName, schemeGrade, schemeDetails})
    const [localDetails, setLocalDetails] = useState<Assessment[]>(schemeDetails)
    const [localGrade, setLocalGrade] = useState<number>(schemeGrade)

    const updateGrade = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {

        const inputValue = e.target.value.trim(); // Remove any leading or trailing spaces
        // If the input is empty, treat it as 0, otherwise parse it as a number
        const parsedValue = inputValue === "" ? 0 : parseFloat(inputValue);
        // If parsedValue is not a number (NaN), use 0
        const clampedValue = isNaN(parsedValue) ? 0 : parsedValue;

        if (clampedValue > 100) {
            return; // Prevent updating the value if it's greater than 100
          }

        // Update local details
        const updatedDetails = localDetails.map((assessment) =>
            assessment.assessmentName === assessmentName
                ? { ...assessment, grade: clampedValue }
                : assessment
        );

        // Update local Grade
        const updatedGrade = updatedDetails.reduce((total, assessment) => {
            return total + ((assessment.grade * assessment.weight) / 100);
        }, 0);

        // Update local states
        setLocalDetails(updatedDetails);
        setLocalGrade(parseFloat(updatedGrade.toFixed(2)));

        setLocalScheme({schemeName, schemeGrade:updatedGrade, schemeDetails:updatedDetails})
    };


    return ( 
        <div className="w-4/5">
            <h1 className="text-center mb-4 font-medium">{localScheme.schemeName}</h1>
            <div className="w-full border border-gray-100 px-5 pt-4 rounded-3xl shadow-sm" style={{ height: "30rem", overflowY: "auto" }}>
                <Table className="my-4">
                    <TableHeader>
                        <TableRow>  
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Weight</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {localScheme.schemeDetails.slice(startIndex, startIndex + rowsPerPage).map((assessment) => {
                        return (
                                <TableRow key={assessment.assessmentName}>
                                    <TableCell className="text-center">{assessment.assessmentName}</TableCell>
                                    <TableCell className="text-center">{assessment.weight}</TableCell>
                                    <TableCell className="text-center"> 
                                    <Input
                                        type="number"
                                        value={assessment.grade || ''}
                                        onChange={(e) => updateGrade(e, assessment.assessmentName)}
                                        placeholder="00"
                                        className="w-16 p-2 inline"
                                        />{" "}
                                        %
                                    </TableCell>
                                </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </div>
            <h1>Total Grade: {localGrade}</h1>
        </div>
        
     )
}
 
export default GradeSchemeCard;
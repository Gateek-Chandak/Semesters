// // React Imports
// import { useState } from "react";

// // UI Elements
// import {
//     Pagination,
//     PaginationContent,
//     // PaginationEllipsis,
//     PaginationItem,
//     // PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
//   } from "@/components/ui/pagination"  
import {
    Table,
    TableBody,
    // TableCaption,
    // TableFooter,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Input } from "./ui/input";

// Interfaces & Types
interface Assessment {
    assessmentName: string; // Name of the assessment
    weight: number;         // Weight of the assessment
    grade: number | undefined;   // Grade for the assessment (null if not graded)
  }

type GradeSchemeCardProps = {
    schemeName: string;
    schemeDetails: Assessment[];
    key: string;
};

const GradeSchemeCard: React.FC<GradeSchemeCardProps> = ( {schemeName, schemeDetails} ) => {

    const rowsPerPage = 20;
    const startIndex: number = 0
    // const [startIndex, setStartIndex] = useState<number>(0)
    // const totalRows = Object.entries(schemeDetails).length;

    return ( 
        <div className="w-4/5 border border-gray-100 px-5 pt-4 rounded-3xl shadow-sm" style={{ height: "35rem", overflowY: "auto" }}>
            <h1 className="text-center mb-4 font-medium">{schemeName}</h1>
            <Table className="my-4">
                <TableHeader>
                    <TableRow>  
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Weight</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                </TableHeader>
                {schemeDetails.slice(startIndex, startIndex + rowsPerPage).map((assessment) => {
                    return (
                        <TableBody key={assessment.assessmentName}>
                            <TableRow>
                                <TableCell className="text-center">{assessment.assessmentName}</TableCell>
                                <TableCell className="text-center">{assessment.weight}</TableCell>
                                <TableCell className="text-center"> <Input type="text" value={assessment.grade} placeholder="" className="w-14 inline" />  %</TableCell>
                            </TableRow>
                        </TableBody>
                    )
                })}
            </Table>
            {/* <Pagination>
                <PaginationContent >
                <PaginationItem >
                    <PaginationPrevious
                    className={startIndex === 0 ? "pointer-events-none opacity-50 hover:cursor-pointer" : "hover:cursor-pointer"}
                    onClick={() => {
                        if (startIndex > 0) {
                        setStartIndex(startIndex - rowsPerPage);
                        }
                    }}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                    className={
                        startIndex + rowsPerPage >= totalRows ? "pointer-events-none opacity-50 hover:cursor-pointer" : "hover:cursor-pointer"
                    }
                    onClick={() => {
                        if (startIndex + rowsPerPage < totalRows) {
                        setStartIndex(startIndex + rowsPerPage);
                        }
                    }}
                    />
                </PaginationItem>
                </PaginationContent>
            </Pagination> */}
        </div>
     )
}
 
export default GradeSchemeCard;
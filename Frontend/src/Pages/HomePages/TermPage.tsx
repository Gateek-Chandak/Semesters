import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";


const TermPage = () => {

    let { term } = useParams()

    if (term) {
        term = term
            .replace('-', ' ') // Replace '-' with a space
            .toLowerCase()     // Convert the string to lowercase
            .split(' ')        // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' ');        // Join the words back together
    }

    return ( 
        <div className="h-full p-10 flex flex-col gap-10 bg-[#f7f7f7]">
            <div className="flex flex-row gap-4 items-center">
                <h1 className="text-4xl font-bold">{term} :</h1>
                <h1 className="text-4xl">Monday, January 6th</h1>
            </div>
            <div className="grid grid-cols-3 gap-10 h-96">
                <Card>
                    
                </Card>
                <Card>
                    
                </Card>
                <Card>
                
                </Card>
            </div>
            <Card className="h-96"> 
                
            </Card>
            <div className="h-96 grid grid-cols-2 gap-10">
                <Card className=""> 
                
                </Card>
                <Card className=""> 
                
                </Card>
            </div>
        </div>
        );
}
 
export default TermPage;
import { Card } from "../../components/ui/card";
import { format } from 'date-fns';

const Dashboard = () => {

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'EEEE, MMMM dd');

    return ( 
        <div className="h-full px-10 flex flex-col gap-10 bg-[#f7f7f7]">
            <div className="flex pt-14 flex-row gap-10">
                <h1 className="text-3xl font-semibold">Welcome, Gateek</h1>
                <h1 className="text-3xl ml-auto font-light">Today is {formattedDate}</h1>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-10 h-96">
                <Card>
                   
                </Card>
                <Card>
                    
                </Card>
                <Card>
                
                </Card>
            </div>
            <Card className="h-96"> 
                TO DO LIST COMING SOON...
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
 
export default Dashboard;
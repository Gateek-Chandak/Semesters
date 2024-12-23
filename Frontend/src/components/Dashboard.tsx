import { Card } from "./ui/card";

const Dashboard = () => {
    return ( 
        <div className="h-full p-10 flex flex-col gap-10 bg-[#f7f7f7]">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl">Welcome, Gateek</h1>
                <h1>Today is December 23rd, 2024</h1>
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
 
export default Dashboard;
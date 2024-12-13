import GradesPage from "./Grades";
import { useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();

    const getData = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/calendar/create-calendar", {
                withCredentials: true,
            })
            const data = await response.data
            console.log(data)
        } catch {
            navigate("/")
        }
    }

    useEffect(() => {
        getData()

    }, [])

    return ( 
        <div>
            <GradesPage />
        </div>
     );
}
 
export default HomePage;
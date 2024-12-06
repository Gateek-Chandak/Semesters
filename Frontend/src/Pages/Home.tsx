import axios from "axios";

const HomePage = () => {

    const handleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/google-calendar/log-in');
            const googleAuthUrl = response.data.url;

            console.log(response.data)
            window.location.href = googleAuthUrl;
        } catch (error: any) {
            console.error("Error during login:", error.response || error.message);
        }
    }

    return ( 
        <div>
           <button onClick={handleLogin}>Log In</button>
        </div>
     );
}
 
export default HomePage;
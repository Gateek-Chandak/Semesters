import axios from "axios";

const LandingPage = () => {

  const handleLogin = async () => {
      try {
          const response = await axios.get('http://localhost:4000/api/auth/log-in', {
            method: 'GET',
            withCredentials: true,
          });
          const googleAuthUrl = response.data.url;

          window.location.href = googleAuthUrl;

      } catch {
          console.error("Error during login");
      }
  }

  return ( 
      <div>
        <button onClick={handleLogin}>Log In with Google</button>
      </div>
    );
}
 
export default LandingPage;
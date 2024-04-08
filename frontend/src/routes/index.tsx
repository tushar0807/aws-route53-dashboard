import { useNavigate } from "react-router-dom";
import './index.css';
import '@mantine/carousel/styles.css';
import { Text } from '@mantine/core';
import imageSrc from '../assets/dns_manager.png';
import { Button } from '@mantine/core';
import FeatureCards from "../components/FeatureCards";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { AuthContext } from "../context/token";
 
export default function IndexPage() {
  
  const navigate = useNavigate();
  const {state} = useContext(AuthContext)

  const handleButtonClick =()=>{
    if(state.isSignedIn){
      navigate('/dashboard')
    }
    else{
      navigate("/sign-in");
    }
  }

  return (
    
    <div className="container">
      <Navbar />  
        <h1 className="title">DNS Manager</h1>
      <div className="content">
        <div className="centered">
          <Text className="large-text">
            Automate your <br />
            Domain and DNS <br />
            management with ease.
          </Text>
        </div>
        <div className="image-container">
          <img src={imageSrc} alt="Image" />
        </div>
      </div>
      <main>
      <section className="features-section">
          <h2 className="title">Features</h2>
          <FeatureCards />
        </section>
        <section className="get-started-section">
        <Button mb={'xl'} fullWidth onClick={handleButtonClick}>Get Started</Button>
          {/* <p><Link to="/sign-up">Create</Link> an account or <Link to="/sign-in">Sign In</Link> to start managing your DNS settings.</p> */}
        </section>
      </main>
    </div>
  )
}
import { useNavigate } from "react-router-dom";
import './index.css';
import '@mantine/carousel/styles.css';
import { Text } from '@mantine/core';
import imageSrc from '../assets/dns_manager.png';
import { Button } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
 
export default function IndexPage() {
  
  const navigate = useNavigate();

  const handleButtonClick =()=>{
    navigate("/sign-in");
  }

  return (
    
    <div className="container">
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
          <Carousel slideSize="70%" height={200} slideGap="lg" controlsOffset="lg" dragFree>
            <Carousel.Slide><div className="feature-card">
              <h3>Upload, view, and manage domains and DNS records</h3>
            </div>
            </Carousel.Slide>
            <Carousel.Slide><div className="feature-card">
              <h3>Support for various record types like A, AAAA, CNAME, MX, etc.</h3>
            </div></Carousel.Slide>
            <Carousel.Slide><div className="feature-card">
              <h3>Graphical charts for domain and record type distribution</h3>
            </div></Carousel.Slide>
            <Carousel.Slide><div className="feature-card">
              <h3>Bulk data navigation with CSV or JSON uploads</h3>
            </div></Carousel.Slide>
            <Carousel.Slide><div className="feature-card">
              <h3>User Authentication and Authorization</h3>
            </div></Carousel.Slide>
          </Carousel>
          {/* <div className="feature-cards">
            <div className="feature-card">
              <h3>Upload, view, and manage domains and DNS records</h3>
            </div>
            <div className="feature-card">
              <h3>Support for various record types like A, AAAA, CNAME, MX, etc.</h3>
            </div>
            <div className="feature-card">
              <h3>Graphical charts for domain and record type distribution</h3>
            </div>
            <div className="feature-card">
              <h3>Bulk data navigation with CSV or JSON uploads</h3>
            </div>
            <div className="feature-card">
              <h3>User authentication and authorization</h3>
            </div>
          </div> */}
        </section>
        <section className="get-started-section">
        <Button fullWidth onClick={handleButtonClick}>Get Started</Button>
          {/* <p><Link to="/sign-up">Create</Link> an account or <Link to="/sign-in">Sign In</Link> to start managing your DNS settings.</p> */}
        </section>
      </main>
    </div>
  )
}
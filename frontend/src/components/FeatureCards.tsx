import { Carousel } from "@mantine/carousel";
import "../routes/index.css";
import FeatureCard from "./FeatureCard";
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from "react";

const featureArray = [
  {title : 'Manage Domains' , description : 'Upload, view, and manage domains(Hosted Zones) and DNS records.'},
  {title : 'Visualisation' , description : 'Graphical representational charts record type distribution for Domains'},
  {title : 'Navigation' , description : 'Efficient data navigation with  Paginated Tables and Advanced Search and Filter features'},
  {title : 'Management' , description : 'Support Bulk JSON uploads of Records in any Domain'},
  {title : 'Support' , description : 'Including Support for various record types like A, AAAA, CNAME, MX, etc.'},
  {title : 'Intuitive UI' , description : 'Minimalistic and Beautiful User Interface'}
  
]

const FeatureCards = () => {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  return (
    <Carousel
      withIndicators
      align="start"
      loop
      slideSize="30%"
      p="xl"
      slideGap={'lg'} 
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      {featureArray.map((card)=> <Carousel.Slide key={card.title} p={'md'}><FeatureCard title={card.title} description={card.description}/></Carousel.Slide>)}
    </Carousel>
  );
};

export default FeatureCards;

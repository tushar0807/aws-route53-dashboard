import { Carousel } from '@mantine/carousel'
import { Image } from '@mantine/core'

import c1 from '../assets/cc-1.png';
import c2 from '../assets/cc-2.png';
import c3 from '../assets/cc-3.png';
import c4 from '../assets/cc-4.png';
import c5 from '../assets/cc-5.png';
import c6 from '../assets/cc-6.png';
import c7 from '../assets/cc-7.png';
import c8 from '../assets/cc-8.png';
import c9 from '../assets/cc-9.png';
import c10 from '../assets/cc-10.png';

import '../routes/index.css'


const CreateClientCarousel = () => {
  return (
    <Carousel align="start" controlsOffset={'md'} withIndicators p={'xl'} slideSize={'50%'} slideGap={'lg'} slidesToScroll={1} >
      <Carousel.Slide><Image src={c1} /> <h2>1.Search User in AWS Console</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c2}/><h2>2.Click on Create User</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c3}/><h2>3.Enter any username</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c4}/><h2>4.Click on Attached policies and Choose "AmazonRoute53FullAccess"</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c5}/><h2>5.Click on Create User</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c6}/><h2>6.Select the Created User</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c7}/><h2>7. Select the Security Credentials Tab</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c8}/><h2>8.Scroll down and Select Create Access Key</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c9}/><h2>9.Select Third-Party Service , Click Next and you'll get your credentials</h2></Carousel.Slide>
      <Carousel.Slide><Image src={c10}/><h2>10.You can view your credentials , Insert them by clicking on Create Client Button</h2></Carousel.Slide>

    </Carousel>
  )
}

export default CreateClientCarousel
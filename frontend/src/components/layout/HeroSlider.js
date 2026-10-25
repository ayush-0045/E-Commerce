import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, styled } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
  position: 'relative',
  overflow: 'hidden',
  '& .slick-dots': {
    bottom: '25px',
    '& li': {
      margin: '0 5px',
      width: '8px',
      height: '8px',
      '& button': {
        width: '8px',
        height: '8px',
        padding: 0,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        opacity: 1,
        transition: 'all 0.3s ease',
        '&:before': {
          display: 'none',
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        },
      },
      '&.slick-active button': {
        width: '24px',
        backgroundColor: '#D4AF37', // Brighter gold color
        borderRadius: '4px',
        transform: 'none',
        boxShadow: 'none',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    height: '400px',
  },
}));

const Slide = styled(Box)({
  width: '100%',
  height: '500px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  backgroundColor: '#f5f5f5', // Fallback color
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

const SlideContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '10%',
  transform: 'translateY(-50%)',
  textAlign: 'left',
  color: 'white',
  zIndex: 2,
  maxWidth: '500px',
  '& h1': {
    fontSize: '3.5rem',
    marginBottom: '0.5rem',
    fontWeight: 300,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  '& p': {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    fontWeight: 500,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    position: 'relative',
    paddingLeft: '20px',
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '40px',
      height: '2px',
      backgroundColor: '#D4AF37',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      letterSpacing: '2px',
    },
  },
}));

const StyledButton = styled('button')(({ theme }) => ({
  borderRadius: '0',
  padding: '12px 32px',
  fontWeight: 500,
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  letterSpacing: '2px',
  backgroundColor: 'transparent',
  color: '#fff',
  border: '2px solid #D4AF37',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'rgba(212, 175, 55, 0.2)',
    transition: 'all 0.6s ease',
    zIndex: -1,
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(212, 175, 55, 0.4)',
    '&:before': {
      left: 0,
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const HeroSlider = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    arrows: false,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    dotsClass: 'slick-dots',
    appendDots: dots => (
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ul style={{ 
          margin: '0', 
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          listStyle: 'none',
        }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          margin: '0 5px',
          transition: 'all 0.3s ease',
        }}
      />
    ),
  };

    // Import images directly from public/images/slider/
  const image1 = process.env.PUBLIC_URL + '/images/slider/1.png';
  const image2 = process.env.PUBLIC_URL + '/images/slider/2.jpg';
  const image3 = process.env.PUBLIC_URL + '/images/slider/3.jpg';

  const slides = [
    {
      id: 1,
      image: image1,
      title: 'exclusive offer',
      subtitle: '-20% off this week',
      description: 'Necklace',
      subdescription: '22 Carat gold necklace for wedding',
      buttonText: 'SHOP NOW',
    },
    {
      id: 2,
      image: image2,
      title: 'exclusive offer',
      subtitle: '-40% off this week',
      description: 'Earings and Pendant',
      subdescription: 'Complete bridal set with white pearls',
      buttonText: 'SHOP NOW',
    },
    {
      id: 3,
      image: image3,
      title: 'exclusive offer',
      subtitle: '-10% off this week',
      description: 'Wedding Rings',
      subdescription: 'Gehana Special wedding rings for couples',
      buttonText: 'SHOP NOW',
    },
  ];

  return (
    <SliderContainer>
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <Slide>
              <img 
                src={slide.image} 
                alt={slide.title} 
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if image fails to load
                  e.target.src = 'https://via.placeholder.com/1920x500/f5f5f5/cccccc?text=Jewelry+Collection';
                }}
              />
              <SlideContent>
                {[1, 2].includes(slide.id) ? (
                  <>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      letterSpacing: '4px',
                      marginBottom: '10px',
                      color: '#D4AF37'
                    }}>
                      {slide.title}
                    </h4>
                    <h3 style={{
                      fontSize: '3rem',
                      fontWeight: 300,
                      margin: '0 0 10px 0',
                      lineHeight: '1.1',
                      color: '#fff'
                    }}>
                      {slide.subtitle}
                    </h3>
                    <p style={{
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      margin: '20px 0 10px 0',
                      position: 'relative',
                      paddingLeft: '60px',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '50px',
                        height: '2px',
                        backgroundColor: '#D4AF37',
                      }
                    }}>
                      {slide.description}
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: 300,
                      margin: '0 0 30px 60px',
                      opacity: 0.8
                    }}>
                      {slide.subdescription}
                    </p>
                    <StyledButton onClick={() => navigate('/shop')}>{slide.buttonText}</StyledButton>
                  </>
                ) : (
                  <>
                    <h1>{slide.title}</h1>
                    <p>{slide.description}</p>
                    <StyledButton onClick={() => navigate('/shop')}>{slide.buttonText}</StyledButton>
                  </>
                )}
              </SlideContent>
            </Slide>
          </div>
        ))}
      </Slider>
    </SliderContainer>
  );
};

export default HeroSlider;

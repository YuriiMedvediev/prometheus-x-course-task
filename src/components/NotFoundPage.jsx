import React, { useEffect, useState } from 'react';
import { useSpring, config, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import errImg from '../assets/error_404.png';
import owlImg from '../assets/owl.png';

function NotFoundPage() {
  const [showOwl, setShowOwl] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowOwl(true);
    }, 500);

    const timer2 = setTimeout(() => {
      setShowPopover(true);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const owlAnimation = useSpring({
    to: {
      right: showOwl ? '0px' : '-190px',
      opacity: showOwl ? 1 : 0,
    },
    config: config.default,
    delay: 500,
  });

  const popoverAnimation = useSpring({
    to: {
      opacity: showPopover ? 1 : 0,
      bottom: showPopover ? '300px' : '-50px',
      right: showPopover ? '150px' : '-50px',
    },
    config: config.default,
  });

  return (
    <section className="errSection">
      <img src={errImg} alt="Error 404" />
      <h1>What a mess? Page is not found!</h1>
      <animated.img
        className="img-owl"
        src={owlImg}
        alt="Owl"
        style={{
          ...owlAnimation,
          position: 'fixed',
          bottom: '20px',
        }}
      />
      <animated.div
        className="popover"
        style={{
          ...popoverAnimation,
          position: 'fixed',
          bottom: '300px',
          right: '150px',
          background: '#fff',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Hey Bro! Wanna some <Link to="/books">books</Link>?
      </animated.div>
    </section>
  );
}

export default NotFoundPage;

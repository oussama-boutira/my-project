import React from "react";

import AboutSlide from "../composente/AboutSlide";
import CommonSection from "../composente/CommonSection";
import Reviews from "../composente/Reviews";

const About = () => {
  return (
    <div>
        <CommonSection title={"About Us"}/>
        <AboutSlide/>
        <Reviews/>
    </div>
  );
};

export default About;
import React from "react";
import {Route, Routes } from "react-router-dom";
// Composente import 
import Header from "./composente/Header";
import Footer from "./composente/footer";

// Pages import
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Cars from "./pages/Cars";
import Appartements from "./pages/Appartements";
import Agafay from "./pages/Agafay";
import CarDetails from "./pages/CarDetails";
import ApartmentDetails from "./pages/AppartementDetails";
import AgafayDetails from "./pages/AgafayDetails";


const App = () => {
  return (
    <div>
      <Header/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/Voitures" element={<Cars/>} />
        <Route path="/cars/:slug" element={<CarDetails/>} />

        <Route path="/Appartements" element={<Appartements/>} />
        <Route path="/appartements/:slug" element={<ApartmentDetails/>} />

        <Route path="/Agafay" element={<Agafay/>} />
        <Route path="/agafay/:slug" element={<AgafayDetails/>} />
        
        <Route path="/contact" element={<Contact />} />

        
      </Routes>

      <Footer/>
    </div>
  );
};

export default App;
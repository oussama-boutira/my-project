import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Composants importés
import Header from "./pages/Header";

// Pages importées
import VoituresList from "./pages/voituresList";
import AppartementList from "./pages/AppartementList";
import AgafayList from "./pages/AgafayList";
import ReviewList from "./pages/ReviewList";
import CarReserve from "./pages/CarReserve";
import Profil from "./pages/profil";
import Login from "./pages/Login";
import AppartementReserve from "./pages/AppartementReserve";
import AgafayReserve from "./pages/AgafayReserve";

//  Composant pour protéger les routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation();
  const showHeader = location.pathname !== "/login";

  return (
    <div>
      {showHeader && <Header />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/reviews" element={<PrivateRoute><ReviewList /></PrivateRoute>} />
        <Route path="/voitures" element={<PrivateRoute><VoituresList /></PrivateRoute>} />
        <Route path="/appartements" element={<PrivateRoute><AppartementList /></PrivateRoute>} />
        <Route path="/agafay" element={<PrivateRoute><AgafayList /></PrivateRoute>} />

        <Route path="/reservation/voitures" element={<PrivateRoute><CarReserve/></PrivateRoute>} />
        <Route path="/reservation/appartements" element={<PrivateRoute><AppartementReserve/></PrivateRoute>} />
        <Route path="/reservation/agafay" element={<PrivateRoute><AgafayReserve/></PrivateRoute>} />
        <Route path="/profil" element={<PrivateRoute><Profil /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App;

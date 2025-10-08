import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaRegFileAlt, FaCalendarAlt, FaCar, FaHome } from "react-icons/fa";
import { GiDesert } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/profil.css';

const services = [
  { name: 'Reviews', path: '/reviews', icon: <FaRegFileAlt /> },
  { name: 'Voitures', path: '/voitures', icon: <FaCar /> },
  { name: 'Reservations des voutiures', path: '/reservation/voitures', icon: <FaCalendarAlt /> },
  { name: 'Appartements', path: '/appartements', icon: <FaHome /> },
  { name: 'Reservations des appartements', path: '/reservation/appartements', icon: <FaCalendarAlt /> },
  { name: 'Agafay', path: '/agafay', icon: <GiDesert /> },
  { name: 'Reservations dans Agafay', path: '/reservation/agafay', icon: <FaCalendarAlt /> },
];

const Profil = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        if (!adminId) {
          navigate("/login");
          return;
        }
  
        const response = await axios.get(`/api/admin/show/${adminId}`);
        const admin = response.data;  // ici tu récupères uniquement l'admin connecté
        setUser(admin);
        setForm({
          name: admin.name,
          email: admin.email,
          password: '',
          newPassword: '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [navigate]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let updatedData = {
        name: form.name,
        email: form.email,
      };

      if (form.newPassword) {
        updatedData = { ...updatedData, newPassword: form.newPassword, password: form.password };
      }

      const response = await axios.put(`/api/admin/update/${user._id}`, updatedData);

      if (response.status === 200) {
        setUser(response.data);
        alert("Profil mis à jour !");
        setIsModalOpen(false);
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Une erreur est survenue.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="profil-container">
      <div className="profil-card">
        <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
          alt="Profil" className="profil-image" />
        <div className="profil-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button className="edit-button" onClick={() => setIsModalOpen(true)}>
            <FaEdit /> Modifier les informations
          </button>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut /> Déconnexion
          </button>
        </div>

        {/* Tableau de services */}
        <div className="services-table">
          <h3>Services disponibles</h3>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Accès</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, index) => (
                <tr key={index}>
                  <td>{s.icon} {s.name}</td>
                  <td>
                    <Link to={s.path} className="service-link-btn">Accéder</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Modifier les informations</h3>

            <label>Nom d'utilisateur</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} />

            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />

            <label>Mot de passe actuel</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} />

            <label>Nouveau mot de passe</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />

            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Annuler</button>
              <button onClick={handleSave} className="save-btn">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;

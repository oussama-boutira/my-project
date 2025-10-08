import React, { useState, useEffect } from "react";
import "../styles/ListStyles.css";
import { FaSearch } from "react-icons/fa";

const VoituresList = () => {
  const [voitures, setVoitures] = useState([]);
  const [filteredVoitures, setFilteredVoitures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentVoiture, setCurrentVoiture] = useState(null);
  const [newVoiture, setNewVoiture] = useState({
    brand: "",
    carName: "",
    model: "",
    price: "",
    speed: "",
    transmission: "",
    fuel_type: "",
    available: true,
    description: "",
    image1: null,
    image2: null,
    image3: null,
  });

  useEffect(() => {
    fetch("/api/car/show")
      .then((res) => res.json())
      .then((data) => {
        setVoitures(data);
        setFilteredVoitures(data);
      })
      .catch((err) => console.error("Erreur chargement voitures:", err));
  }, []);

  useEffect(() => {
    const results = voitures.filter((v) =>
      v.carName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVoitures(results);
  }, [searchTerm, voitures]);

  const handleAddModal = () => setIsAddOpen(true);
  const handleCloseAdd = () => {
    setIsAddOpen(false);
    setNewVoiture({
      brand: "",
      carName: "",
      model: "",
      price: "",
      speed: "",
      transmission: "",
      fuel_type: "",
      available: true,
      description: "",
      image1: null,
      image2: null,
      image3: null,
    });
  };

  const handleAddVoiture = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newVoiture).forEach(([key, value]) => {
      if (value !== null) {
        if (key.startsWith("image") && value) {
          formData.append("images", value);
        } else {
          formData.append(key, value);
        }
      }
    });

    fetch("/api/car/create", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setVoitures((prev) => [...prev, data]);
        setFilteredVoitures((prev) => [...prev, data]);
        handleCloseAdd();
      })
      .catch((err) => console.error("Erreur ajout voiture:", err));
  };

  const handleEditClick = (voiture) => {
    setCurrentVoiture({
      ...voiture,
      image1: null,
      image2: null,
      image3: null,
    });
    setIsModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsModalOpen(false);
    setCurrentVoiture(null);
  };

  const handleUpdateVoiture = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(currentVoiture).forEach(([key, value]) => {
      if (value !== null) {
        if (key.startsWith("image") && value) {
          formData.append("images", value);
        } else {
          formData.append(key, value);
        }
      }
    });

    fetch(`/api/car/update/${currentVoiture._id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = voitures.map((v) => (v._id === data._id ? data : v));
        setVoitures(updated);
        setFilteredVoitures(updated);
        handleCloseEdit();
      })
      .catch((err) => console.error("Erreur mise à jour voiture:", err));
  };

  const handleDeleteVoiture = (voitureId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) {
      fetch(`/api/car/delete/${voitureId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setVoitures((prev) => prev.filter((v) => v._id !== voitureId));
          setFilteredVoitures((prev) => prev.filter((v) => v._id !== voitureId));
        })
        .catch((err) => console.error("Erreur suppression:", err));
    }
  };

  const handleInputChange = (e, isNew = false) => {
    const { name, value, type, checked } = e.target;
    const updater = isNew ? setNewVoiture : setCurrentVoiture;
    const target = isNew ? newVoiture : currentVoiture;

    updater({
      ...target,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e, imageKey, isNew = false) => {
    const file = e.target.files[0];
    const updater = isNew ? setNewVoiture : setCurrentVoiture;
    const target = isNew ? newVoiture : currentVoiture;

    updater({
      ...target,
      [imageKey]: file,
    });
  };

  return (
    <div className="table-container">
      <h2>Gestion des voitures</h2>

      <button onClick={handleAddModal} className="add_btn">
        Ajouter une voiture
      </button>

      <div className="search-container">
        <input
          type="text"
          className="search_inp"
          placeholder="Rechercher par nom de voiture"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch />
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Image 1</th>
            <th>Image 2</th>
            <th>Image 3</th>
            <th>Marque</th>
            <th>Nom</th>
            <th>Modèle</th>
            <th>Prix</th>
            <th>Vitesse</th>
            <th>Transmission</th>
            <th>Carburant</th>
            <th>Disponible</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVoitures.map((voiture) => (
            <tr key={voiture._id}>
              <td>
                {voiture.images[0] && (
                  <img src={voiture.images[0]} alt="img1" className="product-image" />
                )}
              </td>
              <td>
                {voiture.images[1] && (
                  <img src={voiture.images[1]} alt="img2" className="product-image" />
                )}
              </td>
              <td>
                {voiture.images[2] && (
                  <img src={voiture.images[2]} alt="img3" className="product-image" />
                )}
              </td>
              <td>{voiture.brand}</td>
              <td>{voiture.carName}</td>
              <td>{voiture.model}</td>
              <td>{voiture.price} MAD</td>
              <td>{voiture.speed} km/h</td>
              <td>{voiture.transmission}</td>
              <td>{voiture.fuel_type}</td>
              <td>{voiture.available ? "Oui" : "Non"}</td>
              <td>{voiture.description}</td>
              <td>
                <button onClick={() => handleEditClick(voiture)} className="edit-btn">
                  Modifier
                </button>
                <button onClick={() => handleDeleteVoiture(voiture._id)} className="delete-btn">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL AJOUT */}
      {isAddOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseAdd}>
              &times;
            </span>
            <h3>Ajouter une voiture</h3>
            <form onSubmit={handleAddVoiture}>
              <input type="text" name="brand" placeholder="Marque" onChange={(e) => handleInputChange(e, true)} required />
              <input type="text" name="carName" placeholder="Nom" onChange={(e) => handleInputChange(e, true)} required />
              <input type="text" name="model" placeholder="Modèle" onChange={(e) => handleInputChange(e, true)} required />
              <input type="number" name="price" placeholder="Prix" onChange={(e) => handleInputChange(e, true)} min={200} max={500} required />
              <input type="number" name="speed" placeholder="Vitesse (km/h)" onChange={(e) => handleInputChange(e, true)} min={80} max={240} required />
              <input type="text" name="transmission" placeholder="Transmission" onChange={(e) => handleInputChange(e, true)} required />
              <input type="text" name="fuel_type" placeholder="Type de carburant" onChange={(e) => handleInputChange(e, true)} required />
              <textarea name="description" placeholder="Description" value={newVoiture.description} onChange={(e) => handleInputChange(e, true)} required />
              <label>Image 1 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image1", true)} required />
              <label>Image 2 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image2", true)} required />
              <label>Image 3 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image3", true)} required />
              <label>
                Disponible :
                <input type="checkbox" name="available" checked={newVoiture.available} onChange={(e) => handleInputChange(e, true)} />
              </label>
              <button type="submit" className="update-btn">Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER */}
      {isModalOpen && currentVoiture && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseEdit}>
              &times;
            </span>
            <h3>Modifier une voiture</h3>
            <form onSubmit={handleUpdateVoiture}>
              <input type="text" name="brand" value={currentVoiture.brand} onChange={handleInputChange} required />
              <input type="text" name="carName" value={currentVoiture.carName} onChange={handleInputChange} required />
              <input type="text" name="model" value={currentVoiture.model} onChange={handleInputChange} required />
              <input type="number" name="price" value={currentVoiture.price} onChange={handleInputChange} min={200} max={500} required />
              <input type="number" name="speed" value={currentVoiture.speed} onChange={handleInputChange} min={80} max={240} required />
              <input type="text" name="transmission" value={currentVoiture.transmission} onChange={handleInputChange} required />
              <input type="text" name="fuel_type" value={currentVoiture.fuel_type} onChange={handleInputChange} required />
              <textarea name="description" value={currentVoiture.description} onChange={handleInputChange} required />
              <label>Changer Image 1 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image1")} />
              <label>Changer Image 2 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image2")} />
              <label>Changer Image 3 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image3")} />
              <label>
                Disponible :
                <input type="checkbox" name="available" checked={currentVoiture.available} onChange={handleInputChange} />
              </label>
              <button type="submit" className="update-btn">Mettre à jour</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoituresList;

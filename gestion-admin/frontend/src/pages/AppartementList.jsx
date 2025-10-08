import React, { useState, useEffect } from "react";
import "../styles/ListStyles.css";
import { FaSearch } from "react-icons/fa";

const AppartementList = () => {
  const [appartements, setAppartements] = useState([]);
  const [filteredAppartements, setFilteredAppartements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentAppartement, setCurrentAppartement] = useState(null);
  const [newAppartement, setNewAppartement] = useState({
    name: "",
    address: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    balcony: false,
    shower: false,
    floor: "",
    buildingType: "",
    image1: null,
    image2: null,
    image3: null,
    available: true,
  });

  useEffect(() => {
    fetch("/api/appartement/show")
      .then((response) => response.json())
      .then((data) => {
        setAppartements(data);
        setFilteredAppartements(data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des appartements:", error)
      );
  }, []);

  useEffect(() => {
    const results = appartements.filter((a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppartements(results);
  }, [searchTerm, appartements]);

  const handleAddModal = () => setIsAddOpen(true);
  const handleCloseAdd = () => {
    setIsAddOpen(false);
    setNewAppartement({
      name: "",
      address: "",
      description: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      balcony: false,
      shower: false,
      floor: "",
      buildingType: "",
      image1: null,
      image2: null,
      image3: null,
      available: true,
    });
  };

  const handleAddAppartement = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newAppartement.name);
    formData.append("address", newAppartement.address);
    formData.append("description", newAppartement.description);
    formData.append("price", newAppartement.price);
    formData.append("bedrooms", newAppartement.bedrooms);
    formData.append("bathrooms", newAppartement.bathrooms);
    formData.append("balcony", newAppartement.balcony);
    formData.append("shower", newAppartement.shower);
    formData.append("floor", newAppartement.floor);
    formData.append("buildingType", newAppartement.buildingType);
    formData.append("available", newAppartement.available);
    if (newAppartement.image1) formData.append("images", newAppartement.image1);
    if (newAppartement.image2) formData.append("images", newAppartement.image2);
    if (newAppartement.image3) formData.append("images", newAppartement.image3);

    fetch("/api/appartement/create", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setAppartements((prev) => [...prev, data]);
        setFilteredAppartements((prev) => [...prev, data]);
        handleCloseAdd();
      })
      .catch((err) => console.error("Erreur lors de l'ajout:", err));
  };

  const handleEditClick = (appartement) => {
    setCurrentAppartement({
      ...appartement,
      image1: null,
      image2: null,
      image3: null,
    });
    setIsModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsModalOpen(false);
    setCurrentAppartement(null);
  };

  const handleUpdateAppartement = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentAppartement.name);
    formData.append("address", currentAppartement.address);
    formData.append("description", currentAppartement.description);
    formData.append("price", currentAppartement.price);
    formData.append("bedrooms", currentAppartement.bedrooms);
    formData.append("bathrooms", currentAppartement.bathrooms);
    formData.append("balcony", currentAppartement.balcony);
    formData.append("shower", currentAppartement.shower);
    formData.append("floor", currentAppartement.floor);
    formData.append("buildingType", currentAppartement.buildingType);
    formData.append("available", currentAppartement.available);

    // Ajouter uniquement les images modifiées
    if (currentAppartement.image1) formData.append("images", currentAppartement.image1);
    if (currentAppartement.image2) formData.append("images", currentAppartement.image2);
    if (currentAppartement.image3) formData.append("images", currentAppartement.image3);

    fetch(`/api/appartement/update/${currentAppartement._id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = appartements.map((a) => (a._id === data._id ? data : a));
        setAppartements(updated);
        setFilteredAppartements(updated);
        handleCloseEdit();
      })
      .catch((err) => console.error("Erreur mise à jour:", err));
  };

  const handleDeleteAppartement = (appartementId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet appartement ?")) {
      fetch(`/api/appartement/delete/${appartementId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setAppartements((prev) => prev.filter((a) => a._id !== appartementId));
          setFilteredAppartements((prev) => prev.filter((a) => a._id !== appartementId));
        })
        .catch((err) => console.error("Erreur suppression:", err));
    }
  };

  const handleInputChange = (e, isNew = false) => {
    const { name, value, type, checked } = e.target;
    const updater = isNew ? setNewAppartement : setCurrentAppartement;
    const target = isNew ? newAppartement : currentAppartement;

    updater({
      ...target,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e, imageKey, isNew = false) => {
    const file = e.target.files[0];
    const updater = isNew ? setNewAppartement : setCurrentAppartement;
    const target = isNew ? newAppartement : currentAppartement;

    updater({
      ...target,
      [imageKey]: file,
    });
  };

  return (
    <div className="table-container">
      <h2>Gestion des appartements</h2>

      <button onClick={handleAddModal} className="add_btn">
        Ajouter un appartement
      </button>

      <div className="search-container">
        <input
          type="text"
          className="search_inp"
          placeholder="Rechercher par nom"
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
            <th>Nom</th>
            <th>Adresse</th>
            <th>Description</th>
            <th>Chambres</th>
            <th>Salles de bain</th>
            <th>Balcon</th>
            <th>Douche</th>
            <th>Étage</th>
            <th>Prix</th>
            <th>Disponible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppartements.map((appartement) => (
            <tr key={appartement._id}>
              <td>
                {appartement.images[0] && (
                  <img src={appartement.images[0]} alt="img1" className="product-image" />
                )}
              </td>
              <td>
                {appartement.images[1] && (
                  <img src={appartement.images[1]} alt="img2" className="product-image" />
                )}
              </td>
              <td>
                {appartement.images[2] && (
                  <img src={appartement.images[2]} alt="img3" className="product-image" />
                )}
              </td>
              <td>{appartement.name}</td>
              <td>{appartement.address}</td>
              <td>{appartement.description}</td>
              <td>{appartement.bedrooms}</td>
              <td>{appartement.bathrooms}</td>
              <td>{appartement.balcony ? "Oui" : "Non"}</td>
              <td>{appartement.shower ? "Oui" : "Non"}</td>
              <td>{appartement.floor}</td>
              <td>{appartement.price} MAD</td>
              <td>{appartement.available ? "Oui" : "Non"}</td>
              <td>
                <button onClick={() => handleEditClick(appartement)} className="edit-btn">
                  Modifier
                </button>
                <button onClick={() => handleDeleteAppartement(appartement._id)} className="delete-btn">
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
            <h3>Ajouter un appartement</h3>
            <form onSubmit={handleAddAppartement}>
              <input type="text" name="name" placeholder="Nom" onChange={(e) => handleInputChange(e, true)} required />
              <input type="text" name="address" placeholder="Adresse" onChange={(e) => handleInputChange(e, true)} required />
              <textarea name="description" placeholder="Description" onChange={(e) => handleInputChange(e, true)} required />
              <input type="number" name="price" placeholder="Prix" onChange={(e) => handleInputChange(e, true)} min={500} required />
              <input type="number" name="bedrooms" placeholder="Nombre de chambres" onChange={(e) => handleInputChange(e, true)} min={1} max={7} required />
              <input type="number" name="bathrooms" placeholder="Nombre de salles de bain" onChange={(e) => handleInputChange(e, true)} min={1} max={5} required />
              <label>Balcon :</label>
              <input type="checkbox" name="balcony" checked={newAppartement.balcony} onChange={(e) => handleInputChange(e, true)} />
              <label>Douche :</label>
              <input type="checkbox" name="shower" checked={newAppartement.shower} onChange={(e) => handleInputChange(e, true)} />
              <input type="number" name="floor" placeholder="Étage" onChange={(e) => handleInputChange(e, true)} min={1} max={5} required />
              <input type="text" name="buildingType" placeholder="Type de bâtiment" onChange={(e) => handleInputChange(e, true)} required />
              <label>Image 1 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image1", true)} required />
              <label>Image 2 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image2", true)} required />
              <label>Image 3 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image3", true)} required />
              <label>
                Disponible :
                <input type="checkbox" name="available" checked={newAppartement.available} onChange={(e) => handleInputChange(e, true)} />
              </label>
              <button type="submit" className="update-btn">Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER */}
      {isModalOpen && currentAppartement && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseEdit}>
              &times;
            </span>
            <h3>Modifier un appartement</h3>
            <form onSubmit={handleUpdateAppartement}>
              <input type="text" name="name" value={currentAppartement.name} onChange={handleInputChange} required />
              <input type="text" name="address" value={currentAppartement.address} onChange={handleInputChange} required />
              <textarea name="description" value={currentAppartement.description} onChange={handleInputChange} required />
              <input type="number" name="price" value={currentAppartement.price} onChange={handleInputChange} min={500} required />
              <input type="number" name="bedrooms" value={currentAppartement.bedrooms} onChange={handleInputChange} min={1} max={7} required />
              <input type="number" name="bathrooms" value={currentAppartement.bathrooms} onChange={handleInputChange} min={1} max={5} required />
              <label>Balcon :</label>
              <input type="checkbox" name="balcony" checked={currentAppartement.balcony} onChange={handleInputChange} />
              <label>Douche :</label>
              <input type="checkbox" name="shower" checked={currentAppartement.shower} onChange={handleInputChange} />
              <input type="number" name="floor" value={currentAppartement.floor} onChange={handleInputChange} min={1} max={5} required />
              <label>Changer Image 1 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image1")} />
              <label>Changer Image 2 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image2")} />
              <label>Changer Image 3 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image3")} />
              <label>
                Disponible :
                <input type="checkbox" name="available" checked={currentAppartement.available} onChange={handleInputChange} />
              </label>
              <button type="submit" className="update-btn">Mettre à jour</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppartementList;

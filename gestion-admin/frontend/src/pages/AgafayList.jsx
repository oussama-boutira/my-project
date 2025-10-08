import React, { useState, useEffect } from "react";
import "../styles/ListStyles.css";
import { FaSearch } from "react-icons/fa";

const AgafayList = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    duration: "",
    description: "",
    price: "",
    image1: null,
    image2: null,
    image3: null,
    available: true,
  });

  useEffect(() => {
    fetch("/api/agafay/show")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
        setFilteredServices(data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des services:", error)
      );
  }, []);

  useEffect(() => {
    const results = services.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(results);
  }, [searchTerm, services]);

  const handleAddModal = () => setIsAddOpen(true);
  const handleCloseAdd = () => {
    setIsAddOpen(false);
    setNewService({
      name: "",
      duration: "",
      description: "",
      price: "",
      image1: null,
      image2: null,
      image3: null,
      available: true,
    });
  };

  const handleAddService = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newService.name);
    formData.append("duration", newService.duration);
    formData.append("description", newService.description);
    formData.append("price", newService.price);
    formData.append("available", newService.available);
    if (newService.image1) formData.append("images", newService.image1);
    if (newService.image2) formData.append("images", newService.image2);
    if (newService.image3) formData.append("images", newService.image3);

    fetch("/api/agafay/create", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setServices((prev) => [...prev, data]);
        setFilteredServices((prev) => [...prev, data]);
        handleCloseAdd();
      })
      .catch((err) => console.error("Erreur lors de l'ajout:", err));
  };

  const handleEditClick = (service) => {
    setCurrentService({
      ...service,
      image1: null,
      image2: null,
      image3: null,
    });
    setIsModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const handleUpdateService = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentService.name);
    formData.append("duration", currentService.duration);
    formData.append("description", currentService.description);
    formData.append("price", currentService.price);
    formData.append("available", currentService.available);

    // Ajouter uniquement les images modifiées
    if (currentService.image1) formData.append("images", currentService.image1);
    if (currentService.image2) formData.append("images", currentService.image2);
    if (currentService.image3) formData.append("images", currentService.image3);

    fetch(`/api/agafay/update/${currentService._id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = services.map((s) => (s._id === data._id ? data : s));
        setServices(updated);
        setFilteredServices(updated);
        handleCloseEdit();
      })
      .catch((err) => console.error("Erreur mise à jour:", err));
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      fetch(`/api/agafay/delete/${serviceId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setServices((prev) => prev.filter((s) => s._id !== serviceId));
          setFilteredServices((prev) => prev.filter((s) => s._id !== serviceId));
        })
        .catch((err) => console.error("Erreur suppression:", err));
    }
  };

  const handleInputChange = (e, isNew = false) => {
    const { name, value, type, checked } = e.target;
    const updater = isNew ? setNewService : setCurrentService;
    const target = isNew ? newService : currentService;

    updater({
      ...target,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e, imageKey, isNew = false) => {
    const file = e.target.files[0];
    const updater = isNew ? setNewService : setCurrentService;
    const target = isNew ? newService : currentService;

    updater({
      ...target,
      [imageKey]: file,
    });
  };

  return (
    <div className="table-container">
      <h2>Gestion des services Agafay</h2>

      <button onClick={handleAddModal} className="add_btn">
        Ajouter un service
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
            <th>Durée</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Disponible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr key={service._id}>
              <td>
                {service.images[0] && (
                  <img src={service.images[0]} alt="img1" className="product-image" />
                )}
              </td>
              <td>
                {service.images[1] && (
                  <img src={service.images[1]} alt="img2" className="product-image" />
                )}
              </td>
              <td>
                {service.images[2] && (
                  <img src={service.images[2]} alt="img3" className="product-image" />
                )}
              </td>
              <td>{service.name}</td>
              <td>{service.duration}</td>
              <td>{service.description}</td>
              <td>{service.price} MAD</td>
              <td>{service.available ? "Oui" : "Non"}</td>
              <td>
                <button onClick={() => handleEditClick(service)} className="edit-btn">
                  Modifier
                </button>
                <button onClick={() => handleDeleteService(service._id)} className="delete-btn">
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
            <h3>Ajouter un service</h3>
            <form onSubmit={handleAddService}>
              <input type="text" name="name" placeholder="Nom" onChange={(e) => handleInputChange(e, true)} required />
              <input type="text" name="duration" placeholder="Durée" onChange={(e) => handleInputChange(e, true)} required />
              <textarea name="description" placeholder="Description" onChange={(e) => handleInputChange(e, true)} required />
              <input type="number" name="price" placeholder="Prix" onChange={(e) => handleInputChange(e, true)} min={100} required />
              <label>Image 1 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image1", true)} required />
              <label>Image 2 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image2", true)} required />
              <label>Image 3 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image3", true)} required />
              <label>
                Disponible :
                <input type="checkbox" name="available" checked={newService.available} onChange={(e) => handleInputChange(e, true)} />
              </label>
              <button type="submit" className="update-btn">Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER */}
      {isModalOpen && currentService && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseEdit}>
              &times;
            </span>
            <h3>Modifier un service</h3>
            <form onSubmit={handleUpdateService}>
              <input type="text" name="name" value={currentService.name} onChange={handleInputChange} required />
              <input type="text" name="duration" value={currentService.duration} onChange={handleInputChange} required />
              <textarea name="description" value={currentService.description} onChange={handleInputChange} required />
              <input type="number" name="price" value={currentService.price} onChange={handleInputChange} min={100} required />
              <label>Changer Image 1 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image1")}/>
              <label>Changer Image 2 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image2")}/>
              <label>Changer Image 3 :</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image3")}/>
              <label>
                Disponible :
                <input type="checkbox" name="available" checked={currentService.available} onChange={handleInputChange} />
              </label>
              <button type="submit" className="update-btn">Mettre à jour</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgafayList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ListStyles.css";
import { FaSearch } from "react-icons/fa";

const AgafayReserve = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [newReservation, setNewReservation] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    type: "service",
    itemName: "",
    item_id: "",
    start_date: "",
    total_price: "",
    status: "En Attente",
    persons_count: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/reservation/show/service");
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e, isNew = false) => {
    const { name, value } = e.target;
    if (isNew) {
      const updated = { ...newReservation, [name]: value };
      if (name === "persons_count" && updated.item_id && updated.price) {
        updated.total_price = updated.persons_count * updated.price;
      }
      setNewReservation(updated);
    } else {
      const updated = { ...currentProduct, [name]: value };
      if (name === "persons_count" && currentProduct.price) {
        updated.total_price = value * currentProduct.price;
      }
      setCurrentProduct(updated);
    }
  };

  const handleAddReservation = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/agafay/name/${newReservation.itemName}`);
      const { _id, price } = res.data;

      const reservationData = {
        ...newReservation,
        item_id: _id,
        total_price: newReservation.persons_count * price,
        price,
        available: false,
      };

      await axios.post("/api/reservation/create", reservationData);
      fetchReservations();
      setNewReservation({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        type: "service",
        itemName: "",
        item_id: "",
        start_date: "",
        total_price: "",
        status: "En Attente",
        persons_count: "",
      });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...currentProduct,
        total_price: currentProduct.persons_count * currentProduct.price,
      };
      await axios.put(`/api/reservation/update/${currentProduct._id}`, updated);
      fetchReservations();
      handleCloseModal();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette reservation ?")){
      await axios.delete(`/api/reservation/delete/${id}`);
      fetchReservations();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesStatus = filterStatus ? p.status?.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchesSearch = `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) || p.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });


  const getMinDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // format: "YYYY-MM-DDTHH:MM"
  };

  return (
    <div className="table-container">
      <h2>Réservations Agafay</h2>
      <button onClick={() => setIsAddModalOpen(true)} className="add_btn">Ajouter une réservation</button>
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
      <div className="filter-container">
        <label htmlFor="status-filter">Filtrer par statut:</label>
        <select id="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="">Tous</option>
          <option value="En Attente">En Attente</option>
          <option value="Confirmer">Confirmer</option>
          <option value="Annuler">Annuler</option>
          <option value="Terminer">Terminer</option>
        </select>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Service</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Prix</th>
            <th>Personnes</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.first_name} {product.last_name}</td>
              <td>{product.email}</td>
              <td>{product.phone}</td>
              <td>{product.item_name}</td>
              <td>{product.start_date_only}</td>
              <td>{product.start_time}</td>
              <td>{product.total_price}</td>
              <td>{product.persons_count}</td>
              <td>{product.status}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(product)}>Modifier</button>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && currentProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h3>Modifier la réservation</h3>
            <form onSubmit={handleUpdateProduct}>
              <label>Statut:</label>
              <select name="status" value={currentProduct.status} onChange={handleInputChange}>
                <option value="En Attente">En Attente</option>
                <option value="Confirmer">Confirmer</option>
                <option value="Annuler">Annuler</option>
                <option value="Terminer">Terminer</option>
              </select>
              <label>Personnes:</label>
              <input name="persons_count" type="number" value={currentProduct.persons_count || ""} min={1} max={10} onChange={handleInputChange} />
              <button type="submit" className="update-btn">Mettre à jour</button>
            </form>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsAddModalOpen(false)}>&times;</span>
            <h3>Ajouter une réservation</h3>
            <form onSubmit={handleAddReservation}>
              <input name="first_name" placeholder="Prénom" value={newReservation.first_name} onChange={(e) => handleInputChange(e, true)} required />
              <input name="last_name" placeholder="Nom" value={newReservation.last_name} onChange={(e) => handleInputChange(e, true)} required />
              <input name="email" type="email" placeholder="Email" value={newReservation.email} onChange={(e) => handleInputChange(e, true)} required />
              <input name="phone" placeholder="Téléphone : 0612345678" pattern="^0[5-7][0-9]{8}$" value={newReservation.phone} onChange={(e) => handleInputChange(e, true)} required />
              <input name="itemName" placeholder="Nom du service" value={newReservation.itemName} onChange={(e) => handleInputChange(e, true)} required />
              <input name="start_date" type="datetime-local" min={getMinDateTime()} value={newReservation.start_date} onChange={(e) => handleInputChange(e, true)} required />
              <input name="persons_count" type="number" min={1} max={10} placeholder="Nombre de personnes" value={newReservation.persons_count} onChange={(e) => handleInputChange(e, true)} />
              <select name="status" value={newReservation.status} onChange={(e) => handleInputChange(e, true)}>
                <option value="En Attente">En Attente</option>
                <option value="Confirmer">Confirmer</option>
                <option value="Annuler">Annuler</option>
                <option value="Terminer">Terminer</option>
              </select>
              <button type="submit" className="update-btn">Ajouter</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgafayReserve;

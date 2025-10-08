import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ListStyles.css";
import { FaSearch } from "react-icons/fa";

const CarReserve = () => {
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
    type: "car",
    itemName: "",
    start_date: "",
    status: "En Attente",
    from_address: "",
    to_address: "",
    days_count: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/reservation/show/car");
      const reservationsWithNames = await Promise.all(
        res.data.map(async (r) => {
          try {
            const carRes = await axios.get(`/api/car/${r.item_id}`);
            return {
              ...r,
              itemName: carRes.data?.carName || r.item_id,
              startDateOnly: new Date(r.start_date).toLocaleDateString(),
              startTimeOnly: new Date(r.start_date).toLocaleTimeString(),
            };
          } catch {
            return r;
          }
        })
      );
      setProducts(reservationsWithNames);
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
      if (name === "days_count" && updated.days_count && updated.itemName) {
        fetchCarPrice(updated.itemName, updated.days_count, true, updated);
      } else {
        setNewReservation(updated);
      }
    } else {
      const updated = { ...currentProduct, [name]: value };
      if (name === "days_count" && updated.days_count && updated.itemName) {
        fetchCarPrice(updated.itemName, updated.days_count, false, updated);
      } else {
        setCurrentProduct(updated);
      }
    }
  };

  const fetchCarPrice = async (carName, days, isNew, objToUpdate) => {
    try {
      const res = await axios.get(`/api/car/name/${carName}`);
      const price = res.data.price;
      const item_id = res.data._id;
      const total_price = price * parseInt(days);
      if (isNew) {
        setNewReservation({ ...objToUpdate, item_id, total_price });
      } else {
        setCurrentProduct({ ...objToUpdate, item_id, total_price });
      }
    } catch (err) {
      console.error("Erreur lors du chargement du prix :", err);
    }
  };

  const handleAddReservation = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/car/name/${newReservation.itemName}`);
      const item_id = res.data._id;
      const total_price = res.data.price * parseInt(newReservation.days_count);
      const payload = {
        ...newReservation,
        item_id,
        total_price,
        available: false,
      };
      delete payload.itemName;
      await axios.post("/api/reservation/create", payload);
      fetchReservations();
      setNewReservation({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        type: "car",
        itemName: "",
        start_date: "",
        status: "En Attente",
        from_address: "",
        to_address: "",
        days_count: "",
      });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updated = { ...currentProduct };
      const res = await axios.get(`/api/car/name/${updated.itemName}`);
      const price = res.data.price;
      updated.total_price = price * parseInt(updated.days_count);
      await axios.put(`/api/reservation/update/${updated._id}`, updated);
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
      <h2>Gestion des réservations de voitures</h2>
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
            <th>Voiture</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Prix total</th>
            <th>Adresse départ</th>
            <th>Adresse arrivée</th>
            <th>Jours</th>
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
              <td>{product.total_price} MAD</td>
              <td>{product.from_address}</td>
              <td>{product.to_address}</td>
              <td>{product.days_count}</td>
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
              <label>Adresse départ:</label>
              <input name="from_address" value={currentProduct.from_address || ""} onChange={handleInputChange} />
              <label>Adresse arrivée:</label>
              <input name="to_address" value={currentProduct.to_address || ""} onChange={handleInputChange} />
              <label>Jours:</label>
              <input name="days_count" type="number" min={1} max={31} value={currentProduct.days_count || ""} onChange={handleInputChange} />
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
              <input name="itemName" placeholder="Nom de la voiture" value={newReservation.itemName} onChange={(e) => handleInputChange(e, true)} required />
              <input name="start_date" type="datetime-local" min={getMinDateTime()} value={newReservation.start_date} onChange={(e) => handleInputChange(e, true)} required />
              <input name="from_address" placeholder="Adresse départ" value={newReservation.from_address} onChange={(e) => handleInputChange(e, true)} />
              <input name="to_address" placeholder="Adresse arrivée" value={newReservation.to_address} onChange={(e) => handleInputChange(e, true)} />
              <input name="days_count" type="number" min={1} max={31} placeholder="Nombre de jours" value={newReservation.days_count} onChange={(e) => handleInputChange(e, true)} />
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

export default CarReserve;

import React, { useState , useEffect} from "react";
import "../style/ProductDetails.css";

function ProductDetails() {

  const [products, SetProducts] = useState([])
  const [index, setIndex] = useState(0);

  const getProducts = ()=>{
    fetch("/api/products")
    .then(res => res.json())
    .then(products => SetProducts(products))
    .catch(error => console.error('Erreur:', error));
  }

  useEffect(() => {
    getProducts()
  }, []);

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  return (
    <div className="product-container">
      <section className="product-detail">
        <img src="./IMAGES/Y70-AMD-RYZEN-7-9800X3D-RTX-5080-Setup-Game-300x300.jpg" alt="Product" className="main-product-img" />
        <div className="detail-content">
          <h1 className="product-name">Nom du produit</h1>
          <p className="product-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, vero?</p>
          <h2 className="product-price">Prix : <span>3 000 MAD</span></h2>
          <div className="quantity">
            <label>Quantité :</label>
            <input type="number" defaultValue={1} min={1} max={10} className="quantity-input" />
          </div>
          <button className="add-to-cart">Ajouter au panier</button>
        </div>
      </section>

      <section className="related-products">
        <h2>Produits similaires</h2>
        {/* Carrousel */}
        <div className="carousel">
          <button className="prev" onClick={prevSlide} aria-label="Produit précédent">❮</button>
          <div className="carousel-container">
            {products.slice(index, index + 3).map((product) => (
              <div key={product.id} className="product-slide">
                <img src={product.img} alt={product.name} className="carousel-img" />
                <h3 className="carousel-title">{product.name}</h3>
                <p className="carousel-price">{product.price}</p>
                <button className="view-details">Voir les détails</button>
              </div>
            ))}
          </div>
          <button className="next" onClick={nextSlide} aria-label="Produit suivant">❯</button>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;

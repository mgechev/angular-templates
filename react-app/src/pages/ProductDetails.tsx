import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts();
      const foundProduct = products.find((p) => p.id === Number(id));
      setProduct(foundProduct || null);
    };
    loadProduct();
  }, [id]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <button onClick={() => addToCart({ ...product, quantity: 1 })}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails; 
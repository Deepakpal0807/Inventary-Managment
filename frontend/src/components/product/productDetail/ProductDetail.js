import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../../../redux/features/product/productSlice";
import { SpinnerImg } from "../../loader/Loader";
import DOMPurify from "dompurify";
import Card from "../../card/Card";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import "./ProductDetail.scss";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, isLoading, isError, message } = useSelector((state) => state.product);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      const a=getProduct(id);
      console.log(a);
      dispatch(a);
    }
    if (isError) {
      console.error(message);
    }
  }, [id, isLoggedIn, isError, message, dispatch]);

  const stockStatus = (quantity) => {
    return quantity > 0 ? <span className="--color-success">In Stock</span> : <span className="--color-danger">Out of Stock</span>;
  };
  
  
  console.log(product);


  return (
    <div className="product-detail">
      <h3 className="--mt">Product Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {product && (
        

          <div className="detail">
            <Card cardClass="group">
            {product?.image ? (
  <img src={product.image} alt="Product Image" class="prodimg" />
) : (
  <p>No image available</p>
)}

            </Card>
            <h4>Product Availability: {stockStatus(product.quantity)}</h4>
            <hr />
            <h4>Name: {product.name}</h4>
            {/* <p><b>SKU:</b> {product.sku}</p> */}
            <p><b>Category:</b> {product.category}</p>
            <p><b>Price:</b> Rs. {product.price}</p>
            <p><b>Quantity in stock:</b> {product.quantity}</p>
            <p><b>Total Value in stock:</b> Rs. {product.price * product.quantity}</p>
            <hr />
            <p 
              className="description"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
            ></p>
            <hr />
            <code>Created on: {new Date(product.createdAt).toLocaleString()}</code><br />
            <code>Last Updated: {new Date(product.updatedAt).toLocaleString()}</code>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { getProduct, selectProduct, updateProduct } from "../../redux/features/product/productSlice";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.product.isLoading);
  const productEdit = useSelector(selectProduct);

  const [product, setProduct] = useState(productEdit || {});
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { name, category, price, quantity } = product;

  useEffect(() => {
    if (id) {
      const a=getProduct(id);
      console.log(a);
      dispatch(a);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (productEdit) {
      setProduct(productEdit);
      setImagePreview(productEdit.image ? productEdit.image.filePath : null);
      setDescription(productEdit.description || "");
    }
  }, [productEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("quantity", Number(quantity));
    formData.append("price", price);
    formData.append("description", description);
    if (productImage) formData.append("image", productImage);

    try {
      await dispatch(updateProduct({ id, formData }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={styles.container}>
      {isLoading && <Loader />}
      <h3 style={styles.heading}>Edit Product</h3>
      <form onSubmit={saveProduct} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="category" style={styles.label}>Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="quantity" style={styles.label}>Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="price" style={styles.label}>Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...styles.input, height: "100px", resize: "vertical" }}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="image" style={styles.label}>Product Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
          {imagePreview && <img src={imagePreview} alt="Product Preview" style={styles.imagePreview} />}
        </div>

        <button type="submit" style={styles.button} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  imagePreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    marginTop: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default EditProduct;

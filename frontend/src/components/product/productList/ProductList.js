import React, { useEffect, useState } from "react";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteProduct,
  getProducts,
  updateProduct, // Correct import
} from "../../../redux/features/product/productSlice";
import { Link } from "react-router-dom";
import { BiFontSize } from "react-icons/bi";

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityChange, setQuantityChange] = useState(0); // Make sure this is a number
  const filteredProducts = useSelector(selectFilteredPoducts);

  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text?.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  const delProduct = async (id) => {
    console.log(id);
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  // Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts?.length;
    setItemOffset(newOffset);
  };
  // End Pagination

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantityChange(0); // Reset the quantity change to 0 when modal closes
  };

  const handleQuantityChange = async () => {
    if (selectedProduct && quantityChange !== 0) {
      const newQuantity = selectedProduct.quantity + quantityChange;
      if (newQuantity < 0) {
        alert("Quantity cannot be negative.");
        return;
      }
  
      // Dispatching the update with correct numeric value for quantity
      await dispatch(updateProduct({ 
        id: selectedProduct._id, 
        formData: { quantity: newQuantity } 
      }));
      
      // Re-fetch products to get the updated list
      await dispatch(getProducts());
  
      closeModal(); // Close the modal after updating
    }
  };
  

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && products?.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((product, index) => {
                  const { _id, name, category, price, quantity } = product;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td>{"Rs."}{price}</td>
                      <td>{quantity}</td>
                      <td>{"Rs."}{price * quantity}</td>
                      <td className="icons">
                        <span>
                          <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>
                        </span>
                        <span>
                          <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={20} color={"green"} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                            onClick={() => confirmDelete(_id)}
                          />
                        </span>
                        <span>
                          <button
                            onClick={() => openModal(product)}
                            style={styles.adjustButton}
                          >
                            Adjust Quantity
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>

      {/* Modal for Quantity Adjustment */}
      {showModal && selectedProduct && (
  <div style={styles.modal}>
    <div style={styles.modalContent}>
      <h4>Adjust Quantity for {selectedProduct.name}</h4>
      <div>
        <button style={styles.setbutton} onClick={() => setQuantityChange(quantityChange - 1)}>-</button>
        <input
          type="number"
          value={quantityChange}
          onChange={(e) => setQuantityChange(Number(e.target.value))}  // Ensure value is numeric
          min="0"
          style={styles.quantity}
        />
        <button style={styles.setbutton} onClick={() => setQuantityChange(quantityChange + 1)}>+</button>
      </div>
      <button onClick={handleQuantityChange} style={styles.saveButton}>Save</button>
      <button onClick={closeModal} style={styles.cancelButton}>Cancel</button>
    </div>
  </div>
)}

    </div>
  );
};

const styles = {
  adjustButton: {
    padding: "10px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  quantity:{
    width: "60%",
    
    padding:"5px",
    fontSize:"16px",
    

  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    margin:"20px 10px ",
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    
  },
  modal: {
    position: "fixed",  // Change from absolute to fixed
    top: "0",  // Position at the top
    left: "0",
    right: "0",
    bottom: "0", // Ensure it covers full height
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Transparent background
    display: "flex", // Center modal content
    justifyContent: "center", // Center horizontally
    alignItems: "flex-start", // Align to top
    zIndex: 9999, // Ensure modal is above other content
    paddingTop: "50px", // Add padding from top to space out the modal
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",  // You can adjust this as per your preference
  },
  setbutton:{
    margin:"20px 10px ",
    padding:"5px 5px"
  }
};


export default ProductList;



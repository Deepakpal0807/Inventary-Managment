import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectName, SET_LOGIN } from "../../redux/features/auth/authSlice";
import { logoutUser } from "../../services/authService";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);

  const logout = async () => {
    // eslint-disable-next-line no-restricted-globals
    const a = confirm("Do you want to log out?");
    if (a) {
      try {
        await logoutUser(); // Ensure logoutUser() is an async function
        await dispatch(SET_LOGIN(false)); // Ensure dispatch and SET_LOGIN handle async properly
        navigate("/login"); // Redirect after successful logout
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };

  return (
    <div className="--pad header">
      <div className="--flex-between">
        <h3>
          <span className="--fw-thin">Welcome, </span>
          <span className="--color-danger">{name}</span>
        </h3>
        <button onClick={logout} className="--btn --btn-danger">
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;

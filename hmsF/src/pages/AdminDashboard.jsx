import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut} from "react-icons/fi";

function AdminDashboard(){
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };
    return(
        <>
        <h1>Admin ka dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
        </button>
        </>
    );
}

export default AdminDashboard;
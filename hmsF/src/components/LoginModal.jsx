import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

//Temporary for simple auth
const users = {
  doctor: {
    email: "doctor@medicare.com",
    password: "@dr",
    route: "/DoctorDashboard",
  },
  patient: {
    email: "patient@gmail.com",
    tokenNumber: "123456",
    route: "/PatientDashboard",
  },
  admin: {
    email: "admin@medicare.com",
    password: "@admin",
    route: "/AdminDashboard",
  },
};

function LoginModal( { isOpen, role, onClose } ) {

  const navigate = useNavigate();
//Temporary for simple auth-verfication
  const onSubmit = (data) => {
    const currentUser = users[role];

    if (!currentUser) {
      alert("Invalid role");
      return;
    }

    // Patient Login
    if (role === "patient") {
      if (
        data.email === currentUser.email &&
        data.tokenNumber === currentUser.tokenNumber
      ) {
        navigate(currentUser.route);
        onClose();
      } else {
        alert("Invalid credentials");
      }
      return;
    }

    // Doctor/Admin Login
    if (
      data.email === currentUser.email &&
      data.password === currentUser.password
    ) {
      navigate(currentUser.route);
      onClose();
    } else {
      alert("Invalid credentials");
    }
    alert(`welcome ${role}`);
  };

  const{
    register,
    handleSubmit,
    reset,
    setValue,
    formState:{errors}}= useForm({ 
      defaultValues:{
        email:"",
        tokenNumber:"",
        password:"",
    }})

    useEffect(()=>{
      reset({ email:"", tokenNumber:"", password:"",});
    },[role,isOpen,reset])

  if (!isOpen) return null; 
  // 1. Dynamic UI configuration based on the active role
  const config = {
    doctor: {
      icon: "👨‍⚕️",
      title: "Doctor Login",
      subtitle: "Access your doctor dashboard",
      placeholder: "doctor@medicare.com",
      useTokenFrield : false,
    },
    patient: {
      icon: "⚕️",
      title: "Patient Login",
      subtitle: "Manage your health records and appointments",
      placeholder: "XYZ@gmail.com",
      useTokenFrield : true,
    },
    admin: {
      icon: "👨🏻‍💻",
      title: "Admin Login",
      subtitle: "System control panel portal",
      placeholder: "admin@medicare.com",
      useTokenFrield : false,
    },
  };

  // Get current role values fallback to doctor if something goes wrong
  const current = config[role] || config.doctor;
  return (
    <>
      <div className="modal-overlay" id="modal-overlay" onClick={onClose}></div>

      <div className="login-modal" id={`${role}-login-modal`}>
        <div className="login-form-container" id="doctor-login-form-container">
          <button className="close-modal-btn" id="doctor-close-modal-btn" onClick={onClose}>
            &times;
          </button>

          <div className="modal-header">
            <span className={`modal-icon ${role}`}>{current.icon}</span>
            <h2 className="modal-heading">{current.title}</h2>
            <p className="modal-subtitle">{current.subtitle}</p>
          </div>

          <form className="login-form" id="doctor-login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor={`${role}-email`} className="form-label">
                Email Address
              </label>
              <input type="email" id={`${role}-email`} className="form-input" placeholder={current.placeholder} 
              {...register("email",{required:true})} />
            </div>

            {current.useTokenFrield?(
              <div className="form-group">
              <label htmlFor={`${role}-token`} className="form-label">
                Token Number
              </label>
              <input type="text" inputMode="numeric" maxLength={6}  id={`${role}-token`} 
              className="form-input" placeholder="Enter your 6 digit Token Number" 
              {...register("tokenNumber",{required:true,onChange: (e) => {setValue("tokenNumber", e.target.value.replace(/[^0-9]/g, ""));},})} />
            </div>
            ):(
              <div className="form-group">
              <label htmlFor={`${role}-password`} className="form-label">
                Password
              </label>
              <input type="password" id={`${role}-password`} className="form-input" placeholder="Enter your password" 
              {...register("password",{required:true})}/>
            </div>
            )}


            <button type="submit" className="btn btn-primary full-width" id="doctor-submit-btn" >
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginModal;
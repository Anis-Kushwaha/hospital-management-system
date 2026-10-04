import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

//Temporary for simple auth
const users = {
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

function LoginModal({ isOpen, role, onClose }) {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  //Temporary for simple auth-verfication
  const onSubmit = async (data) => {
    // =========================
    // DOCTOR LOGIN
    // =========================
    if (role === "doctor") {
      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/doctor/login",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();

          if (errorData.email) {
            setError("email", {
              type: "server",
              message: errorData.email,
            });
          }

          if (errorData.password) {
            setError("password", {
              type: "server",
              message: errorData.password,
            });
          }

          return;
        }

        const doctor = await response.json();

        console.log("Logged in doctor:", doctor);

        // Temporary storage until we implement JWT
        localStorage.setItem("doctor", JSON.stringify(doctor));

        onClose();

        navigate("/DoctorDashboard");

        return;
      } catch (error) {
        console.error("Doctor login error:", error);
        alert("Unable to connect to server");
        return;
      }
    }

    // =========================
    // PATIENT LOGIN - TEMPORARY
    // =========================
    if (role === "patient") {
      const currentUser = users.patient;

      if (
        data.email === currentUser.email &&
        data.tokenNumber === currentUser.tokenNumber
      ) {
        onClose();
        navigate(currentUser.route);
      } else {
        alert("Invalid credentials");
      }

      return;
    }

    // =========================
    // ADMIN LOGIN - TEMPORARY
    // =========================
    if (role === "admin") {
      const currentUser = users.admin;

      if (
        data.email === currentUser.email &&
        data.password === currentUser.password
      ) {
        onClose();
        navigate(currentUser.route);
      } else {
        alert("Invalid credentials");
      }

      return;
    }

    alert("Invalid role");
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      tokenNumber: "",
      password: "",
    },
  });

  useEffect(() => {
    reset({ email: "", tokenNumber: "", password: "" });
  }, [role, isOpen, reset]);

  if (!isOpen) return null;
  // 1. Dynamic UI configuration based on the active role
  const config = {
    doctor: {
      icon: "👨‍⚕️",
      title: "Doctor Login",
      subtitle: "Access your doctor dashboard",
      placeholder: "doctor@medicare.com",
      useTokenFrield: false,
    },
    patient: {
      icon: "⚕️",
      title: "Patient Login",
      subtitle: "Manage your health records and appointments",
      placeholder: "XYZ@gmail.com",
      useTokenFrield: true,
    },
    admin: {
      icon: "👨🏻‍💻",
      title: "Admin Login",
      subtitle: "System control panel portal",
      placeholder: "admin@medicare.com",
      useTokenFrield: false,
    },
  };

  // Get current role values fallback to doctor if something goes wrong
  const current = config[role] || config.doctor;
  return (
    <>
      <div className="modal-overlay" id="modal-overlay" onClick={onClose}></div>

      <div className="login-modal" id={`${role}-login-modal`}>
        <div className="login-form-container" id="doctor-login-form-container">
          <button
            className="close-modal-btn"
            id="doctor-close-modal-btn"
            onClick={onClose}
          >
            &times;
          </button>

          <div className="modal-header">
            <span className={`modal-icon ${role}`}>{current.icon}</span>
            <h2 className="modal-heading">{current.title}</h2>
            <p className="modal-subtitle">{current.subtitle}</p>
          </div>

          <form
            className="login-form"
            id="doctor-login-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group">
              <label htmlFor={`${role}-email`} className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? "form-input--error" : ""}`}
                placeholder={current.placeholder}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />

              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            {current.useTokenFrield ? (
              <div className="form-group">
                <label htmlFor={`${role}-token`} className="form-label">
                  Token Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  id={`${role}-token`}
                  className="form-input"
                  placeholder="Enter your 6 digit Token Number"
                  {...register("tokenNumber", {
                    required: true,
                    onChange: (e) => {
                      setValue(
                        "tokenNumber",
                        e.target.value.replace(/[^0-9]/g, ""),
                      );
                    },
                  })}
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor={`${role}-password`} className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={`form-input ${errors.password ? "form-input--error" : ""}`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                {errors.password && (
                  <span className="form-error">{errors.password.message}</span>
                )}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary full-width"
              id="doctor-submit-btn"
            >
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>
        </div>
      </div>
      {loginError && <div className="login-error-toast">{loginError}</div>}
    </>
  );
}

export default LoginModal;

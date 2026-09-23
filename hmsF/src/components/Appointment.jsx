import React, { useState } from "react";
import { useForm } from "react-hook-form";

function Appointment({ onClose }) {
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      date: "",
      slot: "",
      reason: "",
    },
  });

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error();
      }

      const appointment = await response.json();

      setResult(appointment);
      reset();
    } catch {
      setServerError("Unable to book appointment. Please try again.");
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="appointment-modal">
        <button type="button" className="close-modal-btn" onClick={onClose}>
          &times;
        </button>

        <section className="appointment-section">
          <div className="container">
            <div className="appointment-container">
              <div className="appointment-content">
                <h2 className="section-title">Book an Appointment</h2>

                <p className="appointment-description">
                  Schedule your consultation with our experienced doctors.
                </p>

                <div className="appointment-features">
                  {[
                    "Expert Doctors",
                    "24/7 Support",
                    "Easy Scheduling",
                    "Quick Response",
                  ].map((feature) => (
                    <div className="appointment-feature" key={feature}>
                      <span className="feature-icon">✓</span>
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="appointment-form-container">
                {result ? (
                  <div className="appointment-success">
                    <h1>Appointment Confirmed</h1>

                    <p>Your Token Number</p>

                    <h2>{result.token}</h2>

                    <p>Department: {result.department}</p>

                    <p>Date: {result.date}</p>

                    <p>Time: {result.slot}</p>

                    <button className="btn btn-primary" onClick={onClose}>
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="form-title">Request Appointment</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>

                        <input
                          className="form-input"
                          placeholder="Enter your name"
                          {...register("name", {
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Enter a valid name",
                            },
                          })}
                        />

                        {errors.name && (
                          <p className="form-error">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>

                        <input
                          type="email"
                          className="form-input"
                          placeholder="Enter your email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email",
                            },
                          })}
                        />

                        {errors.email && (
                          <p className="form-error">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>

                        <input
                          type="tel"
                          className="form-input"
                          placeholder="Enter your phone number"
                          {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                              value: /^[6-9]\d{9}$/,
                              message: "Enter a valid 10-digit phone number",
                            },
                          })}
                        />

                        {errors.phone && (
                          <p className="form-error">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Department</label>

                        <select
                          className="form-select"
                          {...register("department", {
                            required: "Select a department",
                          })}
                        >
                          <option value="">Select Department</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Orthopedics">Orthopedics</option>
                          <option value="Consultation">
                            Medical Consultation
                          </option>
                          <option value="Obstetrics">
                            Obstetrics & Gynecology
                          </option>
                          <option value="Dermatology">Dermatology</option>
                        </select>

                        {errors.department && (
                          <p className="form-error">
                            {errors.department.message}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Preferred Date</label>

                        <input
                          type="date"
                          min={minDate}
                          className="form-input"
                          {...register("date", {
                            required: "Select a date",
                          })}
                        />

                        {errors.date && (
                          <p className="form-error">{errors.date.message}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Preferred Time Slot
                        </label>

                        <div className="time-slots">
                          {["morning", "afternoon", "evening", "night"].map(
                            (slot) => (
                              <label key={slot}>
                                <input
                                  type="radio"
                                  value={slot}
                                  {...register("slot", {
                                    required: "Select a time slot",
                                  })}
                                />
                                {slot.charAt(0).toUpperCase() + slot.slice(1)}
                              </label>
                            ),
                          )}
                        </div>

                        {errors.slot && (
                          <p className="form-error">{errors.slot.message}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Reason for Visit</label>

                        <textarea
                          className="form-input"
                          placeholder="Briefly describe your concern"
                          {...register("reason", {
                            required: "Reason is required",
                            maxLength: {
                              value: 500,
                              message: "Maximum 500 characters",
                            },
                          })}
                        />

                        {errors.reason && (
                          <p className="form-error">{errors.reason.message}</p>
                        )}
                      </div>

                      {serverError && (
                        <p className="form-error">{serverError}</p>
                      )}

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Booking..." : "Book Appointment"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Appointment;

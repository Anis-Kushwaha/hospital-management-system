import React from "react";
import { useForm } from "react-hook-form";

function Appointment({ onClose }) {

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            department: "",
            date: "",
            slot: "",
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        alert("Appointment requested successfully!");
        reset();
        onClose();
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>

            <div className="appointment-modal">
                <button className="close-modal-btn" onClick={onClose}>
                    &times;
                </button>

                <section className="appointment-section" id="appointment">
                    <div className="container">
                        <div className="appointment-container">

                            {/* Left Content */}
                            <div className="appointment-content">
                                <h2 className="section-title">Book an Appointment</h2>
                                <p className="appointment-description">
                                    Schedule your consultation with our experienced doctors.
                                    Get quality healthcare services with convenient appointment
                                    booking and minimal waiting time.
                                </p>

                                <div className="appointment-features">
                                    <div className="appointment-feature">
                                        <span className="feature-icon">✓</span>
                                        <span className="feature-text">Expert Doctors</span>
                                    </div>

                                    <div className="appointment-feature">
                                        <span className="feature-icon">✓</span>
                                        <span className="feature-text">24/7 Support</span>
                                    </div>

                                    <div className="appointment-feature">
                                        <span className="feature-icon">✓</span>
                                        <span className="feature-text">Easy Scheduling</span>
                                    </div>

                                    <div className="appointment-feature">
                                        <span className="feature-icon">✓</span>
                                        <span className="feature-text">Quick Response</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Form */}
                            <div className="appointment-form-container">
                                <h1 className="form-title">Request Appointment</h1>

                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* Full Name */}
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter your name"
                                            {...register("name", { required: true })}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="Enter your email"
                                            {...register("email", { required: true })}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="Enter your phone number"
                                            {...register("phone", { required: true })}
                                        />
                                    </div>

                                    {/* Department Dropdown */}
                                    <div className="form-group">
                                        <label className="form-label">Department</label>
                                        <select
                                            className="form-select"
                                            {...register("department", { required: true })}
                                        >
                                            <option value="" disabled hidden>
                                                Select Department
                                            </option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Consultation">Medical Consultation</option>
                                            <option value="Obstetrics">Obstetrics & gynecology</option>
                                            <option value="Dermatology">Dermatology</option>
                                        </select>
                                    </div>

                                    {/* Preferred Date */}
                                    <div className="form-group">
                                        <label className="form-label">Preferred Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            {...register("date", { required: true })}
                                        />
                                    </div>

                                    {/* Time Slot */}
                                    <div className="form-group">
                                        <label className="form-label">
                                            Preferred Time Slot
                                        </label>

                                        <div className="time-slots">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="morning"
                                                    {...register("slot", { required: true })}
                                                />
                                                Morning
                                            </label>

                                            <label>
                                                <input
                                                    type="radio"
                                                    value="afternoon"
                                                    {...register("slot", { required: true })}
                                                />
                                                Afternoon
                                            </label>

                                            <label>
                                                <input
                                                    type="radio"
                                                    value="evening"
                                                    {...register("slot", { required: true })}
                                                />
                                                Evening
                                            </label>

                                            <label>
                                                <input
                                                    type="radio"
                                                    value="night"
                                                    {...register("slot", { required: true })}
                                                />
                                                Night
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Book Appointment
                                    </button>

                                </form>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Appointment;
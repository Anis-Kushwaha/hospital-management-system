import { useEffect, useRef, useState } from "react";
import {animate, motion , useScroll} from "motion/react";
import "../app.css";
import LoginModal from "../components/LoginModal";
import ServiceCard from "../components/ServiceCard";
import SpecialistCard from "../components/SpecialistCard";
import PatientSatisfactionSection from "../components/PatientSatisfactionSection";
import Appointment from "../components/Appointment";

const servicesData = [
    {
      id: "emergency",
      icon: "🚑",
      iconClass: "emergency",
      title: "Emergency Care",
      description: "24/7 emergency services with rapid response teams and advanced life support systems.",
      image: "/ambulance.jpg",
      link: "#"
    },
    {
      id: "cardiology",
      icon: "❤️",
      iconClass: "cardiology",
      title: "Cardiology",
      description: "Comprehensive heart care including diagnosis, treatment, and rehabilitation services.",
      image: "/cardiology.png",
      link: "#"
    },
    {
      id: "neurology",
      icon: "🧠", // Swapped to a brain icon to match neurology!
      iconClass: "neurology",
      title: "Neurology",
      description: "Expert care for neurological disorders, brain conditions, and nervous system health.",
      image: "/neurology.png",
      link: "#"
    },
    {
      id: "orthopedics",
      icon: "🦴", // Swapped to a bone icon for orthopedics!
      iconClass: "orthopedics",
      title: "Orthopedics",
      description: "Specialized treatment for bone, joint, and muscle injuries to get you moving again.",
      image: "/orthopedics.png",
      link: "#"
    },
    {
      id: "consultation",
      icon: "🗪", 
      iconClass: "consultation",
      title: "Medical Consultation",
      description: "Get personalized guidance and accurate diagnoses from our senior consultants.",
      image: "/consultation.png",
      link: "#"
    },
    {
      id: "obstetrics ",
      icon: "🌷", 
      iconClass: "Obstetrics ",
      title: "Obstetrics & gynecology",
      description: "On-site pharmacy stocked with essential medical prescriptions available around the clock.",
      image: "/Obstetrics.png",
      link: "#"
    }
  ];
const specialistsData = [
  { id: 1, icon: "⚕️", iconClass: "Doctor1", name: "Anis Kushwaha", description: "A specialized medical doctor focused on diagnosing, treating, and preventing diseases of the cardiovascular system...", link: "#hero" },
  { id: 2, icon: "❤️", iconClass: "Doctor2", name: "Anis Kushwaha", description: "A specialized medical doctor focused on diagnosing, treating, and preventing diseases of the cardiovascular system...", link: "#hero" },
  { id: 3, icon: "🚑", iconClass: "Doctor3", name: "Anis Kushwaha", description: "A specialized medical doctor focused on diagnosing, treating, and preventing diseases of the cardiovascular system...", link: "#hero" },
  { id: 4, icon: "❤️", iconClass: "Doctor4", name: "Anis Kushwaha", description: "Comprehensive heart care including diagnosis, treatment, and rehabilitation services.", link: "#hero" },
  { id: 5, icon: "🚑", iconClass: "Doctor5", name: "Anis Kushwaha", description: "A specialized medical doctor focused on diagnosing, treating, and preventing diseases of the cardiovascular system...", link: "#hero" },
  { id: 6, icon: "❤️", iconClass: "Doctor2", name: "Anis Kushwaha", description: "A specialized medical doctor focused on diagnosing, treating, and preventing diseases of the cardiovascular system...", link: "#hero" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible:{
    opacity: 1,
    transition: { 
    staggerChildren: 0.30,
    }
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1]}
  },
};

function Counter({ from = 0, to, duration = 2 }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const control = animate(from, to, {
      duration: duration,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latestValue) => setCount(Math.floor(latestValue)), // Fixed callback loop
    });
    
    return () => control.stop(); // Fixed clean-up callback syntax
  }, [from, to, duration]);

  return <>{count}</>;
}

function Home() {
  const [activeModal, setActiveModal] = useState(null);
 const [appoint, setAppoint] = useState(false);

  return (
    <>
      {/* ========== NAVBAR SECTION ========== */}
      <nav className="navbar" id="navbar" >
        <div className="navbar-container">
          {/* Logo */}
          <a href="#" className="navbar-logo" id="navbar-logo">
            <span className="logo-icon">+</span>
            <span className="logo-text">MediCare Plus</span>
          </a>

          {/* Navigation Links */}
          <ul className="nav-links" id="nav-links">
            <li><a href="#hero" className="nav-link">Home</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#doctors" className="nav-link">Doctors</a></li>
            <li><a href="#appointment" className="nav-link">Appointment</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>

          {/* Login Buttons Container */}
          <div className="login-buttons-container" id="login-buttons-container">
            <button className="login-btn doctor-login" id="doctor-login-btn" onClick={() => setActiveModal("doctor")} >
              Doctor Login
            </button>

            <button className="login-btn patient-login" id="patient-login-btn" onClick={()=>setActiveModal("patient")} >
              Patient Login
            </button>

            <button className="login-btn admin-login" id="admin-login-btn" onClick={()=>setActiveModal("admin")}>
              Admin Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" id="mobile-menu-toggle">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="hero-section" id="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-heading" id="hero-heading">
              Your Health, Our Priority
            </h1>

            <p className="hero-tagline" id="hero-tagline">
              Experience world-class healthcare with compassionate doctors,
              cutting-edge technology, and personalized treatment plans designed
              just for you.
            </p>

            <div className="hero-buttons" id="hero-buttons">
              <button className="btn btn-primary" id="hero-appointment-btn" onClick={() => setAppoint(true)} > Book Appointment </button>
              <a href="#services" className="btn btn-secondary" id="hero-services-btn" > Our Services </a>
            </div>

            {/* Stats */}
            <div className="hero-stats" id="hero-stats">
              <div className="stat-item">
                <span className="stat-number">
                  <Counter from={0} to={50} duration={1} />+
                </span>
                <span className="stat-label">Expert Doctors</span>
              </div>

              <div className="stat-item">
                <span className="stat-number">
                <Counter from={0} to={1000} duration={1.5} />+
                </span>
                <span className="stat-label">Happy Patients</span>
              </div>

              <div className="stat-item">
                <span className="stat-number">
                  <Counter from={0} to={24} duration={0.7} />/7
                </span>
                <span className="stat-label">Emergency Service</span>
              </div>
            </div>
          </div>

          <div className="hero-image-container" id="hero-image-container">
            <div className="hero-image-wrapper">
              
              {/* FRONT SIDE */}
              <div className="hero-front">
                <div className="hero-image-placeholder">
                  <span className="hero-icon">🏩</span>
                </div>

                {/* Floating Cards */}
                <div className="floating-card card-1">
                  <span className="card-icon">❤️</span>
                  <span className="card-text">100% Success Rate</span>
                </div>

                <div className="floating-card card-2">
                  <span className="card-icon">⭐</span>
                  <span className="card-text">4.9 Rating</span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="hero-back">
                <div className="hero-image-placeholder">
                  <div className="back-content">
                    <h3> 1000+ Lives Changed. Countless Smiles Restored ❤️</h3>
                    <p>1000+ patients trusted us in their most critical moments.</p>
                    <p>More than treatment-we help people reclaim their lives.</p>
                    <h2>Trusted care..Proven outcomes..✨</h2>
                    <a href="#happy-pateints">See our Work &rarr;</a>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section className="services-section" id="services">
        <div className="section-container">
          <motion.div className="section-header" 
          initial={{opacity:0 ,y:30}}
          whileInView={{opacity:1,y:0}}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 , ease:"easeOut"}}
          >
            <span className="section-subtitle">What We Offer</span>
            <h2 className="section-title">Our Medical Services</h2>
            <p className="section-description">
              We provide comprehensive healthcare services with
              state-of-the-art facilities and experienced medical professionals.
            </p>
          </motion.div>
          {/* Services Grid */}
          <motion.div 
            className="services-grid" 
            id="services-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
           >
            {servicesData.map((item) => (
              <motion.div key={item.id} variants={cardVariants}>
                <ServiceCard service={item} />
              </motion.div>
            ))}
          </motion.div>
           
          
        </div>
      </section>

      {/* ========== Our Specialist Doctors Section========== */}
      <section className="Specialist-section" id="doctors">
        <div className="Specialist-container">
          <motion.div className="section-header" 
          initial={{opacity:0 ,y:30}}
          whileInView={{opacity:1,y:0}}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 , ease:"easeOut"}}
          >
            <span className="section-subtitle">Our Team</span>
            <h2 className="section-title">Our Specialist Doctors</h2>
            <p className="section-description">
              We provide comprehensive healthcare services with
              state-of-the-art facilities and experienced medical professionals.
            </p>
          </motion.div>
          {/* Services Grid */}
          <motion.div className="Specialist" id="Specialist"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            >
            {specialistsData.map((doctor)=>(
              <SpecialistCard key={doctor.id} doctor={doctor} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== patient satisfaction SECTION ========== */}
      <motion.section
        initial={{opacity:0 ,y:30}}
        whileInView={{opacity:1,y:0}}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 , ease:"easeOut"}}
        >
        <PatientSatisfactionSection/>
      </motion.section>

      {/* ========== ABOUT SECTION ========== */}
      <motion.section className="about-section" id="about"
        initial={{opacity:0 ,y:30}}
        whileInView={{opacity:1,y:0}}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 , ease:"easeOut"}}
        >
        <div className="section-container">
          <div className="about-grid">
            <img src="/Hospital.png" alt="hospital" className="hospital-img"/>
            <div className="about-content" id="about-content">
              <span className="section-subtitle">About Us</span>
              <h2 className="section-title">Leading Healthcare Provider Since 1999</h2>
              <p className="about-description">
                MediCare Plus has been at the forefront of healthcare innovation
                for over two decades.
              </p>
              <a href="#" className="btn btn-primary" id="about-learn-more-btn">
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </motion.section>
      

      {/* ========== FOOTER SECTION ========== */}
      <motion.footer className="footer-section" id="contact"
        initial={{opacity:0 ,y:30}}
        whileInView={{opacity:1,y:0}}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 , ease:"easeOut"}}
      >
        <div className="section-container">
          <h1>Site is Under Construction</h1>
          <div className="footer-bottom" id="footer-bottom">
            <p className="copyright">
              © 2024 MediCare Plus. All rights reserved.
            </p>

            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* ========== LOGIN MODALS ========== */}
      <LoginModal isOpen={activeModal !== null} role={activeModal} onClose={()=>setActiveModal(null) }/>
      {appoint && ( <Appointment onClose={() => setAppoint(false)} /> )}
    </>
  );
}

export default Home;
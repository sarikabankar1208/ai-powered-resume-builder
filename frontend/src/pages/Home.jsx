import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Navbar.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Build resumes that support real careers, not shortcuts.</h1>

      <p>
        An AI-powered resume builder focused on helping individuals communicate
        their skills clearly, access fair opportunities, and grow sustainably.
      </p>

      <div className="home-buttons">
        <button
          className="primary-btn"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
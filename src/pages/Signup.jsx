import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import API from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (token) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    setFormData((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/signup", formData);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <div
        className="card border-0 shadow-sm p-4"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "12px" }}
      >
        <div className="d-flex align-items-center gap-2 mb-4">
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#4F46E5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            T
          </div>
          <span style={{ fontWeight: "500", fontSize: "18px" }}>TaskForge</span>
        </div>

        <h5 className="mb-1" style={{ fontWeight: "500" }}>
          Create account
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
          Join your team on TaskForge
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "13px" }}>
              Full name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "13px" }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ fontSize: "13px" }}>
              Password
            </label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: "pointer", color: "#64748B" }}
              >
                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#4F46E5",
              color: "white",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0" style={{ fontSize: "13px" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#4F46E5", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

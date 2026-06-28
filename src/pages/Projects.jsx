import { useEffect, useState } from "react";
import API from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // console.log(projects);
  // console.log(loading);
  // console.log(projectFormData);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await API.get("/projects");
      const sortedProjects = response.data.projects.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setProjects(sortedProjects);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const handleProjectChange = (e) => {
    setProjectFormData((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/projects", projectFormData);
      toast.success("Project created successfully");
      setProjectFormData({ name: "", description: "" });
      document.getElementById("closeProjectModal").click();
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontWeight: "500", color: "#1E293B" }}>Projects</h4>
        <button
          className="btn fw-bold"
          data-bs-toggle="modal"
          data-bs-target="#projectModal"
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            borderRadius: "8px",
            fontSize: "13px",
            padding: "8px 16px",
          }}
        >
          <span style={{ fontSize: "16px" }}>+</span> New Project
        </button>
      </div>

      {/* content */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div
            className="spinner-border"
            style={{ color: "#4F46E5" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div
          className="text-center p-4"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
          }}
        >
          <p className="mb-0" style={{ color: "#64748B", fontSize: "14px" }}>
            No projects yet
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {/* project modal */}
      <div
        className="modal fade"
        id="projectModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ borderRadius: "12px", border: "none" }}
          >
            <div
              className="modal-header"
              style={{
                borderBottom: "1px solid #E2E8F0",
                padding: "16px 20px",
              }}
            >
              <h6
                className="modal-title"
                style={{ fontWeight: "500", color: "#1E293B" }}
              >
                Create new project
              </h6>
              <button
                id="closeProjectModal"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ padding: "20px" }}>
              <form onSubmit={handleProjectSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ fontSize: "13px", color: "#64748B" }}
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter project name"
                    value={projectFormData.name}
                    onChange={handleProjectChange}
                    required
                    style={{ fontSize: "13px", borderRadius: "8px" }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="form-label"
                    style={{ fontSize: "13px", color: "#64748B" }}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    placeholder="Enter project description"
                    value={projectFormData.description}
                    onChange={handleProjectChange}
                    rows={3}
                    style={{
                      fontSize: "13px",
                      borderRadius: "8px",
                      resize: "none",
                    }}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn"
                    data-bs-dismiss="modal"
                    style={{
                      fontSize: "13px",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      color: "#64748B",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={submitting}
                    style={{
                      backgroundColor: "#4F46E5",
                      color: "white",
                      fontSize: "13px",
                      borderRadius: "8px",
                    }}
                  >
                    {submitting ? "Creating..." : "Create project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

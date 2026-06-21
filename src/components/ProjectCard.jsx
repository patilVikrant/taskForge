import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <div
      className="col-md-4"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div
        className="p-3"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          cursor: "pointer",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#EEF2FF",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>📁</span>
        </div>
        <p
          className="mb-1"
          style={{ fontWeight: "500", fontSize: "14px", color: "#1E293B" }}
        >
          {project.name}
        </p>
        <p className="mb-0" style={{ fontSize: "12px", color: "#64748B" }}>
          {project.description || "No description"}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;

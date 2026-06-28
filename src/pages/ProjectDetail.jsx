import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import StatusBadge from "../components/StatusBadge";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(id);
  // console.log(project);
  // console.log(tasks);
  // console.log(loading);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const [projectRes, tasksRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get("/tasks"),
        ]);
        setProject(projectRes.data.project);
        const projectTasks = tasksRes.data.tasks.filter(
          (task) => task.project?._id === id,
        );
        setTasks(projectTasks);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  return (
    <div>
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
      ) : (
        <div>
          <div className="mb-4">
            <span
              className="fw-semibold"
              onClick={() => navigate("/projects")}
              style={{
                cursor: "pointer",
                color: "#4F46E5",
                fontSize: "13px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "12px",
              }}
            >
              Back to Projects
            </span>
            <div
              className="p-4"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  📁
                </div>
                <div>
                  <h4
                    className="mb-1"
                    style={{ fontWeight: "500", color: "#1E293B" }}
                  >
                    {project?.name}
                  </h4>
                  <p
                    className="mb-0"
                    style={{ fontSize: "13px", color: "#64748B" }}
                  >
                    {project?.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p
              className="mb-3"
              style={{ fontWeight: "500", fontSize: "16px", color: "#1E293B" }}
            >
              Tasks
            </p>
            {tasks.length === 0 ? (
              <div
                className="text-center p-4"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <p
                  className="mb-0"
                  style={{ color: "#64748B", fontSize: "14px" }}
                >
                  No tasks for this project yet
                </p>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  overflow: "hidden",
                }}
              >
                {/* Heading */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    padding: "10px 16px",
                    borderBottom: "1px solid #E2E8F0",
                    fontSize: "11px",
                    color: "#64748B",
                    letterSpacing: "0.5px",
                    fontWeight: "500",
                  }}
                >
                  <span>TASK</span>
                  <span>TEAM</span>
                  <span>OWNER</span>
                  <span>STATUS</span>
                </div>

                {/* rows */}
                {tasks.map((task, index) => (
                  <div
                    key={task._id}
                    className="task-row"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr",
                      padding: "12px 16px",
                      borderBottom:
                        index === tasks.length - 1
                          ? "none"
                          : "1px solid #E2E8F0",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#1E293B",
                        fontWeight: "500",
                      }}
                    >
                      {task.name}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      {task.team?.name || "-"}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      {task.owners?.map((owner) => owner.name).join(", ") ||
                        "-"}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import StatusBadge from "../components/StatusBadge";
import TaskModal from "../components/TaskModal";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(projects);
  // console.log(tasks);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        API.get("/projects"),
        API.get("/tasks"),
      ]);

      const allProjects = projectsRes.data.projects;
      const allTasks = tasksRes.data.tasks;

      const latestProjects = allProjects
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      const latestTasks = allTasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setProjects(latestProjects);
      setTasks(latestTasks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

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
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4
                className="mb-0"
                style={{ fontWeight: "500", color: "#1E293B" }}
              >
                Welcome back, {user?.name}
              </h4>
              <p
                className="mb-0 mt-1"
                style={{ fontSize: "13px", color: "#64748B" }}
              >
                Here's what's happening today
              </p>
            </div>
            <TaskModal onTaskCreated={fetchData} />
          </div>

          {/* projects */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p
                className="mb-0"
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "#1E293B",
                }}
              >
                Projects
              </p>
              <span
                onClick={() => navigate("/projects")}
                style={{
                  fontSize: "13px",
                  color: "#4F46E5",
                  cursor: "pointer",
                }}
              >
                View all
              </span>
            </div>

            {projects.length === 0 ? (
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
          </div>

          {/* tasks */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p
                className="mb-0"
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "#1E293B",
                }}
              >
                My Tasks
              </p>
              <span
                onClick={() => navigate("/tasks")}
                style={{
                  fontSize: "13px",
                  color: "#4F46E5",
                  cursor: "pointer",
                }}
              >
                View all
              </span>
            </div>
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
                  No tasks yet
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
                  <span>PROJECT</span>
                  <span>TEAM</span>
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
                      {task.project?.name || "-"}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      {task.team?.name || "-"}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

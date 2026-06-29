import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskModal from "../components/TaskModal";
import { useSearchParams, useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);

  // console.log(tasks);
  // console.log(loading);
  // console.log(projects);
  // console.log(teams);

  const activeStatus = searchParams.get("status") || "";
  const activeProject = searchParams.get("project") || "";
  const activeTeam = searchParams.get("team") || "";

  // console.log(activeStatus);
  // console.log(activeTeam);
  // console.log(activeProject);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes, teamsRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
        API.get("/teams"),
      ]);

      const sortedTasks = tasksRes.data.tasks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setTasks(sortedTasks);
      setProjects(projectsRes.data.projects);
      setTeams(teamsRes.data.teams);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, []);

  const handleFilterChange = (key, value) => {
    const params = {};

    if (activeStatus) params.status = activeStatus;
    if (activeProject) params.project = activeProject;
    if (activeTeam) params.team = activeTeam;

    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }

    setSearchParams(params);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (!activeStatus || task.status === activeStatus) &&
      (!activeProject || task.project?._id === activeProject) &&
      (!activeTeam || task.team?._id === activeTeam)
    );
  });

  // console.log(filteredTasks);
  const navigate = useNavigate();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontWeight: "500", color: "#1E293B" }}>Tasks</h4>
        <TaskModal onTaskCreated={fetchAll} />
      </div>

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
          {/* filters */}
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <select
              className="form-select"
              name="status"
              value={activeStatus}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              style={{ fontSize: "13px", borderRadius: "8px", width: "auto" }}
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
            <select
              className="form-select"
              value={activeTeam}
              onChange={(e) => handleFilterChange("team", e.target.value)}
              style={{ fontSize: "13px", borderRadius: "8px", width: "auto" }}
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              className="form-select"
              value={activeProject}
              onChange={(e) => handleFilterChange("project", e.target.value)}
              style={{ fontSize: "13px", borderRadius: "8px", width: "auto" }}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            {/* clear filters */}
            {(activeStatus || activeProject || activeTeam) && (
              <button
                className="btn"
                onClick={() => setSearchParams({})}
                style={{
                  fontSize: "13px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#64748B",
                }}
              >
                Clear filters
              </button>
            )}
          </div>
          {filteredTasks.length === 0 ? (
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
                No tasks found
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
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
                <span>OWNER</span>
                <span>STATUS</span>
              </div>
              {filteredTasks.map((task, index) => (
                <div
                  key={task._id}
                  className="task-row"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                    padding: "12px 16px",
                    borderBottom:
                      index === filteredTasks.length - 1
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
                  <span style={{ fontSize: "12px", color: "#64748B" }}>
                    {task.owners?.map((owner) => owner.name).join(", ") || "-"}
                  </span>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tasks;

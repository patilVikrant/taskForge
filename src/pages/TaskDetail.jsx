import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import { toast } from "react-toastify";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log(id);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: "",
    status: "To Do",
  });

  console.log(editForm);

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // console.log(task);
  // console.log(loading);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const [taskRes, projectsRes, teamsRes, usersRes] = await Promise.all([
          API.get(`/tasks/${id}`),
          API.get("/projects"),
          API.get("/teams"),
          API.get("/users"),
        ]);
        const fetchedTask = taskRes.data.task;
        setTask(fetchedTask);
        setProjects(projectsRes.data.projects);
        setTeams(teamsRes.data.teams);
        setUsers(usersRes.data.users);

        // fill existing data
        setEditForm({
          name: fetchedTask.name,
          project: fetchedTask.project?._id,
          team: fetchedTask.team?._id,
          owners: fetchedTask.owners?.map((owner) => owner._id),
          tags: fetchedTask.tags,
          timeToComplete: fetchedTask.timeToComplete,
          status: fetchedTask.status,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

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
          <span
            className="fw-semibold"
            onClick={() => navigate("/tasks")}
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
            Back to Tasks
          </span>
          <div
            className="p-4"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h4 style={{ color: "#1E293B", margin: 0 }}>{task?.name}</h4>

              <div className="d-flex gap-2">
                <button
                  className="btn fw-semibold"
                  data-bs-toggle="modal"
                  data-bs-target="#editTaskModal"
                  style={{
                    backgroundColor: "#4F46E5",
                    color: "white",
                    fontSize: "13px",
                    borderRadius: "8px",
                    padding: "8px 16px",
                  }}
                >
                  Edit Task
                </button>
                <button
                  className="btn fw-semibold"
                  onClick={handleDelete}
                  style={{
                    backgroundColor: "#FEE2E2",
                    color: "#991B1B",
                    fontSize: "13px",
                    borderRadius: "8px",
                    padding: "8px 16px",
                  }}
                >
                  Delete Task
                </button>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748B",
                    margin: "0 0 4px",
                  }}
                >
                  Project
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#1E293B",
                    margin: 0,
                    fontWeight: "500",
                  }}
                >
                  {task?.project?.name || "-"}
                </p>
              </div>
              <div className="col-md-6">
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748B",
                    margin: "0 0 4px",
                  }}
                >
                  Team
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#1E293B",
                    margin: 0,
                    fontWeight: "500",
                  }}
                >
                  {task?.team?.name || "-"}
                </p>
              </div>
              <div className="col-md-6">
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748B",
                    margin: "0 0 4px",
                  }}
                >
                  Owners
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#1E293B",
                    margin: 0,
                    fontWeight: "500",
                  }}
                >
                  {task?.owners?.map((owner) => owner.name).join(", ") || "-"}
                </p>
              </div>
              <div className="col-md-6">
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748B",
                    margin: "0 0 4px",
                  }}
                >
                  Status
                </p>
                <StatusBadge status={task?.status} />
              </div>
              <div className="col-md-6">
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748B",
                    margin: "0 0 4px",
                  }}
                >
                  Days to complete
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#1E293B",
                    margin: 0,
                    fontWeight: "500",
                  }}
                >
                  {task?.timeToComplete} days
                </p>
              </div>
              <div className="col-md-6">
                <p
                  style={{
                    fontSize: "14px",
                    color: "#64748B",
                    margin: "0 0 4px",
                  }}
                >
                  Tags
                </p>
                <div className="d-flex flex-wrap gap-1">
                  {task?.tags.length > 0 ? (
                    task.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: "#F3F4F6",
                          color: "#374151",
                          fontSize: "14px",
                          padding: "3px 10px",
                          borderRadius: "20px",
                        }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: "14px", color: "#1E293B" }}>
                      -
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                }}
              >
                Created At - {new Date(task?.createdAt).toDateString()}
              </span>
            </div>
          </div>
          <div
            className="modal fade"
            id="editTaskModal"
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
                    Edit task
                  </h6>
                  <button
                    id="closeEditTaskModal"
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: "20px" }}>
                  <p>Edit form will go here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;

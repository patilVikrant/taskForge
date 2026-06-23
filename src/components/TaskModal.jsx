import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const TaskModal = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: "",
    status: "To Do",
  });

  // console.log(formData);

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [projectsRes, teamsRes, usersRes] = await Promise.all([
          API.get("/projects"),
          API.get("/teams"),
          API.get("/users"),
        ]);

        setProjects(projectsRes.data.projects);
        setTeams(teamsRes.data.teams);
        setUsers(usersRes.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOwnerToggle = (userId) => {
    if (!userId) return;
    setFormData((prevValue) => ({
      ...prevValue,
      owners: [...prevValue.owners, userId],
    }));
  };

  const handleRemoveOwner = (userId) => {
    setFormData((prevValue) => ({
      ...prevValue,
      owners: prevValue.owners.filter((id) => id !== userId),
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      // console.log(tagInput.trim());
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prevValue) => ({
          ...prevValue,
          tags: [...prevValue.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prevValue) => ({
      ...prevValue,
      tags: prevValue.tags.filter((t) => t !== tag),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      project: "",
      team: "",
      owners: [],
      tags: [],
      timeToComplete: "",
      status: "To Do",
    });
    setTagInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.owners.length === 0) {
      toast.error("Please select at least one owner");
      return;
    }
    setLoading(true);
    try {
      await API.post("/tasks", formData);
      toast.success("Task created successfully");
      resetForm();
      document.getElementById("closeTaskModal").click();
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* modal button */}
      <button
        className="btn fw-bold"
        data-bs-toggle="modal"
        data-bs-target="#taskModal"
        style={{
          backgroundColor: "#4F46E5",
          color: "white",
          borderRadius: "8px",
          fontSize: "13px",
          padding: "8px 16px",
        }}
      >
        <span style={{ fontSize: "16px" }}>+</span> New Task
      </button>

      {/* modal */}
      <div
        className="modal fade"
        id="taskModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content"
            style={{ borderRadius: "12px", border: "none" }}
          >
            {/* header */}
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
                Create new task
              </h6>
              <button
                id="closeTaskModal"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* body */}
            <div className="modal-body" style={{ padding: "20px" }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ fontSize: "13px", color: "#64748B" }}
                  >
                    Task name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter task name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ fontSize: "13px", borderRadius: "8px" }}
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label
                      className="form-label"
                      style={{ fontSize: "13px", color: "#64748B" }}
                    >
                      Project
                    </label>
                    <select
                      className="form-select"
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "13px", borderRadius: "8px" }}
                    >
                      <option value="">Select project</option>
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label
                      className="form-label"
                      style={{ fontSize: "13px", color: "#64748B" }}
                    >
                      Team
                    </label>
                    <select
                      className="form-select"
                      name="team"
                      value={formData.team}
                      onChange={handleChange}
                      required
                      style={{ fontSize: "13px", borderRadius: "8px" }}
                    >
                      <option value="">Select team</option>
                      {teams.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ fontSize: "13px", color: "#64748B" }}
                  >
                    Owners
                  </label>
                  {/* display selected owners */}
                  {formData.owners.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {formData.owners.map((ownerId) => {
                        const owner = users.find(
                          (user) => user._id === ownerId,
                        );
                        return (
                          <span
                            key={ownerId}
                            style={{
                              backgroundColor: "#EEF2FF",
                              color: "#4F46E5",
                              fontSize: "12px",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {owner.name}
                            <span
                              onClick={() => handleRemoveOwner(ownerId)}
                              style={{ cursor: "pointer", fontWeight: "bold" }}
                            >
                              x
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <select
                    className="form-select"
                    style={{ fontSize: "13px", borderRadius: "8px" }}
                    value=""
                    onChange={(e) => handleOwnerToggle(e.target.value)}
                  >
                    <option value="">Add Owner</option>
                    {users
                      .filter((user) => !formData.owners.includes(user._id))
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ fontSize: "13px", color: "#64748B" }}
                  >
                    Tags
                    <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                      (press Enter to add)
                    </span>
                  </label>

                  {/* display tags */}
                  {formData.tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            backgroundColor: "#F3F4F6",
                            color: "#374151",
                            fontSize: "12px",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {tag}
                          <span
                            onClick={() => handleRemoveTag(tag)}
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                          >
                            x
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    style={{ fontSize: "13px", borderRadius: "8px" }}
                  />
                </div>
                <div className="row mb-4">
                  <div className="col-6">
                    <label
                      style={{ fontSize: "13px", color: "#64748B" }}
                      className="form-label"
                    >
                      Days to complete
                    </label>
                    <input
                      type="number"
                      placeholder="Enter no. of days to complete the task"
                      className="form-control"
                      name="timeToComplete"
                      value={formData.timeToComplete}
                      onChange={handleChange}
                      style={{ fontSize: "13px", borderRadius: "8px" }}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label
                      className="form-label"
                      style={{ fontSize: "13px", color: "#64748B" }}
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                      style={{ fontSize: "13px", borderRadius: "8px" }}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
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
                    disabled={loading}
                    style={{
                      backgroundColor: "#4F46E5",
                      color: "white",
                      fontSize: "13px",
                      borderRadius: "8px",
                    }}
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;

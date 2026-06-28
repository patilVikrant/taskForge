import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // console.log(teams);
  // console.log(loading);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await API.get("/teams");
      setTeams(response.data.teams);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeams();
  }, []);

  const handleTeamChange = (e) => {
    setTeamForm((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/teams", teamForm);
      toast.success("Team created successfully");
      setTeamForm({ name: "", description: "" });
      document.getElementById("closeTeamModal").click();
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontWeight: "500", color: "#1E293B" }}>Teams</h4>
        <button
          className="btn fw-bold"
          data-bs-toggle="modal"
          data-bs-target="#teamModal"
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            borderRadius: "8px",
            fontSize: "13px",
            padding: "8px 16px",
          }}
        >
          <span style={{ fontSize: "16px" }}>+</span> New Team
        </button>
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
      ) : teams.length === 0 ? (
        <div
          className="text-center p-4"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
          }}
        >
          <p className="mb-0" style={{ color: "#64748B", fontSize: "14px" }}>
            No teams yet
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {teams.map((team) => (
            <div className="col-md-3" key={team._id}>
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 10px",
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#4F46E5",
                  }}
                >
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <p
                  className="mb-1"
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#1E293B",
                  }}
                >
                  {team.name}
                </p>
                <p
                  className="mb-0"
                  style={{ fontSize: "12px", color: "#64748B" }}
                >
                  {team.description || "No description"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* team modal */}
      <div
        className="modal fade"
        id="teamModal"
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
                Create new team
              </h6>
              <button
                id="closeTeamModal"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ padding: "20px" }}>
              <form onSubmit={handleTeamSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ fontSize: "13px", color: "#64748B" }}
                  >
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter team name"
                    value={teamForm.name}
                    onChange={handleTeamChange}
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
                    placeholder="Enter team description"
                    value={teamForm.description}
                    onChange={handleTeamChange}
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
                    {submitting ? "Creating..." : "Create team"}
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

export default Teams;

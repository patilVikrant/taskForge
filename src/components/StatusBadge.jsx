const StatusBadge = ({ status }) => {
  const styles = {
    "To Do": { backgroundColor: "#F3F4F6", color: "#374151" },
    "In Progress": { backgroundColor: "#FEF3C7", color: "#92400E" },
    Completed: { backgroundColor: "#DCFCE7", color: "#166534" },
    Blocked: { backgroundColor: "#FEE2E2", color: "#991B1B" },
  };
  return (
    <div>
      <span
        style={{
          ...styles[status],
          fontSize: "11px",
          padding: "3px 10px",
          borderRadius: "20px",
          fontWeight: "500",
          display: "inline-block",
        }}
      >
        {status}
      </span>
    </div>
  );
};

export default StatusBadge;

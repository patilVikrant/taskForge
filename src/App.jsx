import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <div className="container mt-5">
        <h1 className="text-primary">TaskForge</h1>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App;

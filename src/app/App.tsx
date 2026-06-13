import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { Organizations } from "./components/Organizations";
import { Departments } from "./components/Departments";
import { Roles } from "./components/Roles";
import { FieldsAndFiles } from "./components/FieldsAndFiles";
import { Templates } from "./components/Templates";
import { Processes } from "./components/Processes";
import { Employees } from "./components/Employees";
import { Settings } from "./components/Settings";
import { RoleSelection } from "./components/RoleSelection";
import { ManagerLayout } from "./components/manager/ManagerLayout";
import { CreateProcessPage } from "./components/CreateProcessPage";

type Role = null | "admin" | "manager";

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showCreateProcess, setShowCreateProcess] = useState(false);

  // Role Selection Screen
  if (currentRole === null) {
    return <RoleSelection onSelectRole={setCurrentRole} />;
  }

  // Manager (Department Head) Dashboard
  if (currentRole === "manager") {
    return <ManagerLayout onExit={() => setCurrentRole(null)} />;
  }

  // Create Process Page
  if (showCreateProcess) {
    return <CreateProcessPage onBack={() => setShowCreateProcess(false)} />;
  }

  // Existing Technical Admin Dashboard — unchanged
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "organizations":
        return <Organizations />;
      case "departments":
        return <Departments />;
      case "roles":
        return <Roles />;
      case "fields-and-files":
        return <FieldsAndFiles />;
      case "templates":
        return <Templates />;
      case "processes":
        return <Processes onCreateNew={() => setShowCreateProcess(true)} />;
      case "employees":
        return <Employees />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor: "var(--background)",
        direction: "rtl",
      }}
    >
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onExit={() => setCurrentRole(null)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
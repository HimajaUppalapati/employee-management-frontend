import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const API_URL = "https://employee-management-backend-production-7c09.up.railway.app/api/employees";

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      alert("Error fetching employees. Make sure backend is running on port 8080.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new employee
  const addEmployee = async () => {
    if (!form.name || !form.email || !form.department) return alert("All fields required");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setForm({ name: "", email: "", department: "" });
      fetchEmployees();
    } catch (err) {
      console.error("Failed to add employee", err);
      alert("Error adding employee. Check console for details.");
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchEmployees();
    } catch (err) {
      console.error("Failed to delete employee", err);
      alert("Error deleting employee. Check console for details.");
    }
  };

  return (
    <div className="App">
      <h1>Employee Management</h1>

      <div className="form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <button onClick={addEmployee}>Add Employee</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="5">No employees found</td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;

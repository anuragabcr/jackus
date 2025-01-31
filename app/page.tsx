"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  address?: Address;
  phone?: string;
  website?: string;
  company?: Company;
}

interface EditUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export default function Home() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [editUser, setEditUser] = useState<EditUser | null>(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError(null);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Error fetching users.");
      console.error(err);
    }
  };

  const addUser = async () => {
    try {
      await axios.post("https://jsonplaceholder.typicode.com/users", newUser);
      const newUserWithId = {
        ...newUser,
        id: Date.now(),
        name: `${newUser.firstName} ${newUser.lastName}`,
        company: {
          name: newUser.department,
        },
      };
      setUsers((prevUsers) => [...prevUsers, newUserWithId]);
      setNewUser({ firstName: "", lastName: "", email: "", department: "" });
      toast.success("User added successfully!");
    } catch (error) {
      setError("Error adding user.");
      console.error(error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user?.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      setError("Error deleting user.");
      console.error(err);
    }
  };

  const startEditing = (user: User) => {
    const transformedUser: EditUser = {
      id: user.id,
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user.name?.split(" ")[1] || "",
      email: user.email || "",
      department: user.company?.name || "",
    };

    setEditUser(transformedUser);
  };

  const updateUser = async () => {
    try {
      await axios.put(
        `https://jsonplaceholder.typicode.com/users/${editUser?.id}`,
        editUser
      );
      const updatedUser = {
        ...editUser,
        name: `${editUser?.firstName} ${editUser?.lastName}`,
        company: {
          name: editUser?.department,
        },
      };
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === editUser?.id ? updatedUser : user))
      );
      setEditUser(null);
      toast.success("User updated successfully!");
    } catch (error) {
      setError("Error updating user.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Department</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user?.name?.split(" ")[0]}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user?.name?.split(" ")[1]}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.company?.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => startEditing(user)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">
          {editUser ? "Edit User" : "Add User"}
        </h2>
        <form>
          <input
            type="text"
            placeholder="First Name"
            className="border rounded p-2 mb-2 w-full"
            value={editUser ? editUser.firstName : newUser.firstName}
            onChange={(e) =>
              editUser
                ? setEditUser({ ...editUser, firstName: e.target.value })
                : setNewUser({ ...newUser, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border rounded p-2 mb-2 w-full"
            value={editUser ? editUser.lastName : newUser.lastName}
            onChange={(e) =>
              editUser
                ? setEditUser({ ...editUser, lastName: e.target.value })
                : setNewUser({ ...newUser, lastName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded p-2 mb-2 w-full"
            value={editUser ? editUser.email : newUser.email}
            onChange={(e) =>
              editUser
                ? setEditUser({ ...editUser, email: e.target.value })
                : setNewUser({ ...newUser, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Department"
            className="border rounded p-2 mb-2 w-full"
            value={editUser ? editUser.department : newUser.department}
            onChange={(e) =>
              editUser
                ? setEditUser({ ...editUser, department: e.target.value })
                : setNewUser({ ...newUser, department: e.target.value })
            }
          />
          <button
            type="button"
            onClick={editUser ? updateUser : addUser}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {editUser ? "Update" : "Add"}
          </button>
          {editUser && (
            <button
              onClick={() => setEditUser(null)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

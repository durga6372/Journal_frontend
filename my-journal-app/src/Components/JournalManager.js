import React, { useState, useEffect } from "react";
import axios from "axios";

const JournalManager = () => {
  const [journals, setJournals] = useState([]);
  const [newJournal, setNewJournal] = useState({ titel: "", content: "" });
  const [editId, setEditId] = useState(null);
  const [editJournal, setEditJournal] = useState({ titel: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8082/jornal", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setJournals(response.data);
      if (response.data.length === 0) {
        console.log("No journals found for the user");
      }
    } catch (err) {
      setError("Failed to fetch journals.");
    } finally {
      setLoading(false);
    }
  };

  const addJournal = async () => {
    if (!newJournal.titel.trim() || !newJournal.content.trim()) return;

    try {
      const response = await axios.post("http://localhost:8082/jornal", newJournal, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setJournals(prev => [...prev, response.data]);
      setNewJournal({ titel: "", content: "" });
    } catch {
      alert("Failed to add journal.");
    }
  };

  const deleteJournal = async (id) => {
  console.log("Deleting journal with ID:", id);  // Check this is a string
  try {
    await axios.delete(`http://localhost:8082/jornal/id/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setJournals(prev => prev.filter(j => j.id !== id));
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete journal.");
  }
};

  const startEditing = (journal) => {
    setEditId(journal.id);
    setEditJournal({ titel: journal.titel, content: journal.content });
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8082/jornal/id/${id}`, editJournal, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setJournals(prev => prev.map(j => (j.id === id ? response.data : j)));
      setEditId(null);
    } catch {
      alert("Failed to update journal.");
    }
  };

  if (loading) return <p>Loading journals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ width: "600px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Journal Manager</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={newJournal.titel}
          onChange={(e) => setNewJournal(prev => ({ ...prev, titel: e.target.value }))}
          style={{ width: "40%", marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Content"
          value={newJournal.content}
          onChange={(e) => setNewJournal(prev => ({ ...prev, content: e.target.value }))}
          style={{ width: "40%", marginRight: 10 }}
        />
        <button onClick={addJournal} style={{ padding: "5px 10px" }}>
          Add
        </button>
      </div>

      {journals.length === 0 ? (
        <p>No journals found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {journals.map(journal => (
            <li
              key={journal.id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                background: "#f0f0f0"
              }}
            >
              {editId === journal.id ? (
                <>
                  <input
                    type="text"
                    value={editJournal.titel}
                    onChange={(e) =>
                      setEditJournal(prev => ({ ...prev, titel: e.target.value }))
                    }
                    style={{ width: "40%", marginRight: 10 }}
                  />
                  <input
                    type="text"
                    value={editJournal.content}
                    onChange={(e) =>
                      setEditJournal(prev => ({ ...prev, content: e.target.value }))
                    }
                    style={{ width: "40%", marginRight: 10 }}
                  />
                  <button onClick={() => saveEdit(journal.id)} style={{ marginRight: 10 }}>
                    Save
                  </button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{journal.titel}</strong>: {journal.content}
                  <button
                    onClick={() => startEditing(journal)}
                    style={{ marginLeft: 10, marginRight: 5 }}
                  >
                    Edit
                  </button>
                  <button
  onClick={() => {
    console.log("Deleting journal with ID:", journal._id?.$oid); // Safe debug
    deleteJournal(journal._id?.$oid);
  }}
>
  Delete
</button>

                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JournalManager;

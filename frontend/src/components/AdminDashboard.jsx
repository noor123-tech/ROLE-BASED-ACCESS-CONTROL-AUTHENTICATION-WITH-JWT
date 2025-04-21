import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [competitions, setCompetitions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/competitions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompetitions(response.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/competitions/${editingId}`,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/competitions',
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchCompetitions();
    } catch (error) {
      console.error('Error saving competition:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/competitions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompetitions();
    } catch (error) {
      console.error('Error deleting competition:', error);
    }
  };

  const handleEdit = (comp) => {
    setTitle(comp.title);
    setDescription(comp.description);
    setEditingId(comp.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4">Admin Dashboard</h2>

      {/* Logout Button */}
      <button onClick={handleLogout} className="btn btn-danger mb-4">Logout</button>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label htmlFor="title" className="font-weight-bold">Competition Title</label>
          <input
            id="title"
            type="text"
            placeholder="Competition Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="font-weight-bold">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Competition Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? 'Update' : 'Add'} Competition
        </button>
      </form>

      <h3 className="mb-3">All Competitions</h3>
      <ul className="list-group">
        {competitions.map((comp) => (
          <li key={comp.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{comp.title}</strong> - {comp.description}
            </div>
            <div>
              <button
                onClick={() => handleEdit(comp)}
                className="btn btn-warning btn-sm mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(comp.id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;

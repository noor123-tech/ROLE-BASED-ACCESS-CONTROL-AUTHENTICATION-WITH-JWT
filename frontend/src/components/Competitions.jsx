import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchCompetitions = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/competitions', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCompetitions(response.data);
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Available Competitions</h2>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>

      <div className="row">
        {competitions.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-warning" role="alert">
              No competitions available at the moment.
            </div>
          </div>
        ) : (
          competitions.map((comp) => (
            <div key={comp.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{comp.title}</h5>
                  <p className="card-text">{comp.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Competitions;

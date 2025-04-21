import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Try a different username.');
      console.error(err);
    }
  };

  return (
    <div className="container-fluid bg-light" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card shadow-lg rounded border-0" style={{ width: '500px', height: '550px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4 text-primary">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
          {error && <p className="text-danger mt-3">{error}</p>}
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login" className="text-decoration-none text-primary">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

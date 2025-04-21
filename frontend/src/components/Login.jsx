import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // ✅ Correct import

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log('Attempting to login with:', { username, password });

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      console.log('Login response:', response);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        const user = jwtDecode(response.data.token);  // ✅ Use jwtDecode here
        console.log('Decoded user:', user);

        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/competitions');
        }
      } else {
        setError('No token received.');
        console.error('Error: No token in response');
      }
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container-fluid bg-light" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card shadow-lg rounded border-0" style={{ width: '500px', height: '550px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4 text-primary">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          {error && <p className="text-danger mt-3">{error}</p>}
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/" className="text-decoration-none text-primary">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock initial load
  useEffect(() => {
    let db = JSON.parse(localStorage.getItem('renthub_users_db')) || [];
    
    // Force Jane to 90% Trust
    let jane = db.find(u => u.email === 'janesmith@gmail.com');
    if (!jane) {
      jane = { id: 'user_jane', name: 'Jane Smith', email: 'janesmith@gmail.com', phone: '9876543210', password: 'password123', kyc_verified: false };
      db.push(jane);
    }
    jane.transactions_count = 6;
    jane.rating_avg = 4.5; // (4.5 / 5) * 100 = 90%

    // Force Govind to 75% Trust
    let govind = db.find(u => u.email === 'govindg@gmail.com');
    if (!govind) {
      govind = { id: 'user_govind', name: 'Govind G', email: 'govindg@gmail.com', phone: '9876543212', password: 'password123', kyc_verified: false };
      db.push(govind);
    }
    govind.transactions_count = 6;
    govind.rating_avg = 3.75; // (3.75 / 5) * 100 = 75%

    localStorage.setItem('renthub_users_db', JSON.stringify(db));

    // User requested NO AUTO LOGIN AT START so they can test the buying flow gates.
    setLoading(false);
  }, []);

  const registerUser = (email, password) => {
    let db = JSON.parse(localStorage.getItem('renthub_users_db')) || [];
    if (db.find(u => u.email === email)) return null; // Exists
    const newUser = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email,
      password,
      kyc_verified: false,
      transactions_count: 0,
      rating_avg: 0
    };
    db.push(newUser);
    localStorage.setItem('renthub_users_db', JSON.stringify(db));
    return newUser;
  };

  const attemptLogin = (email, password) => {
    const db = JSON.parse(localStorage.getItem('renthub_users_db')) || [];
    const matched = db.find(u => u.email === email && u.password === password);
    return matched || null;
  };

  const loginUser = (userData) => {
    // Update the database to reflect any changes (like KYC being true!)
    let db = JSON.parse(localStorage.getItem('renthub_users_db')) || [];
    const index = db.findIndex(u => u.id === userData.id);
    if (index !== -1) {
      db[index] = userData;
      localStorage.setItem('renthub_users_db', JSON.stringify(db));
    }
    localStorage.setItem('token', 'mock_jwt_token_' + userData.id);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const validatePassword = (pwd) => {
    return user && user.password === pwd;
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, validatePassword, registerUser, attemptLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

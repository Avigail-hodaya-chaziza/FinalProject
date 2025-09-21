import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAsAdmin } from './adminApi';

export default function AdminLoginForm() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await loginAsAdmin(id, email);
    if (response.error) {
      alert('אימות נכשל: ' + response.error);
    } else {
      localStorage.setItem('adminName', response.name || 'Admin');
      navigate('/admin');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>תעודת זהות:</label>
        <input type="text" value={id} onChange={e => setId(e.target.value)} required />
      </div>
      <div>
        <label>אימייל:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <button type="submit">התחבר</button>
    </form>
  );
}

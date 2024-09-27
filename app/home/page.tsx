'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/user');  // No need to manually pass the token
        setUsername(response.data.username);
        setUserId(response.data.id);
      } catch (error) {
        alert('User is not authenticated');
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Welcome, {username},{userId}</h1>
    </div>
  );
}

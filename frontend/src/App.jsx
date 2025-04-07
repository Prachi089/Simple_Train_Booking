import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const URL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [seats, setSeats] = useState([]);
  const [count, setCount] = useState('');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    const res = await axios.get(`${URL}/seats`);
    setSeats(res.data);
  };

  const handleAuth = async (e, type) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const res = await axios.post(`${URL}/${type}`, { username, password });
    setUser(res.data);
    fetchSeats();
  };

  const bookSeats = async () => {
    if (!count || count < 1 || count > 7) return alert('Enter 1 to 7 seats');
    await axios.post(`${URL}/book`, { count: parseInt(count), userId: user._id });
    setCount('');
    fetchSeats();
  };

  const resetBookings = async () => {
    await axios.post(`${URL}/reset`);
    fetchSeats();
  };

  const getColor = (seat) => {
    if (!seat.booked) return 'green';
    return seat.bookedBy === user?._id ? 'blue' : 'red';
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>Login / Signup</h2>
        <form onSubmit={(e) => handleAuth(e, 'login')}>
          <input name="username" placeholder="Username" />
          <input name="password" placeholder="Password" type="password" />
          <button type="submit">Login</button>
        </form>
        <form onSubmit={(e) => handleAuth(e, 'signup')}>
          <input name="username" placeholder="Username" />
          <input name="password" placeholder="Password" type="password" />
          <button type="submit">Signup</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Ticket Booking</h1>
      <div className="seat-grid">
        {seats.map((seat) => (
          <div
            key={seat.number}
            className="seat"
            style={{ backgroundColor: getColor(seat) }}
          >
            {seat.number}
          </div>
        ))}
      </div>
      <div className="booking-panel">
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="Enter number of seats"
        />
        <button onClick={bookSeats}>Book</button>
        <button onClick={resetBookings}>Reset Booking</button>
        <p>
          <span style={{ color: 'blue' }}>Blue</span>: Yours |{' '}
          <span style={{ color: 'red' }}>Red</span>: Booked |{' '}
          <span style={{ color: 'green' }}>Green</span>: Available
        </p>
      </div>
    </div>
  );
}

export default App;

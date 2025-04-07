const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Seat = require('./models/Seat');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/train_booking');

//initialize seats if not present
async function initSeats() 
{
  const count = await Seat.countDocuments();
  if(count === 0) 
  {
    const seats = [];
    for(let i = 1; i <= 80; i++) 
    {
      seats.push({ number: i });
    }
    await Seat.insertMany(seats);
  }
}
initSeats();

//signup
app.post('/signup', async (req, res)=>{
  const { username, password } = req.body;
  const user = await User.create({ username, password });
  res.json(user);
});

//login
app.post('/login', async (req, res)=>{
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json(user);
});

//fetch all seats
app.get('/seats', async (req, res) => 
{
  const seats = await Seat.find();
  res.json(seats);
});

//book seats
app.post('/book', async (req, res)=> 
{
  const { count, userId } = req.body;
  if (count < 1 || count > 7) return res.status(400).json({ message: 'Invalid seat count' });

  const allSeats = await Seat.find();
  const availableSeats = allSeats.filter(seat => !seat.booked);
  if (availableSeats.length < count) return res.status(400).json({ message: 'Not enough seats' });

  //try to booking in same row
  for (let i = 0; i < 12; i++) 
  {
    const rowStart = i * 7 + 1;
    const rowEnd = i === 11 ? 80 : rowStart + 6;
    const rowSeats = allSeats
      .filter(seat => seat.number >= rowStart && seat.number <= rowEnd && !seat.booked)
      .sort((a, b) => a.number - b.number);

    for (let j = 0; j <= rowSeats.length - count; j++) 
    {
      const group = rowSeats.slice(j, j + count);
      const isContiguous = group[group.length - 1].number - group[0].number + 1 === count;
      if (isContiguous) {
        for (let s of group) {
          s.booked = true;
          s.bookedBy = userId;
          await s.save();
        }
        return res.json({ success: true, bookedSeats: group });
      }
    }
  }

  //else book closest available seats
  const seatsToBook = availableSeats.slice(0, count);
  for (let s of seatsToBook) {
    s.booked = true;
    s.bookedBy = userId;
    await s.save();
  }
  res.json({ success: true, bookedSeats: seatsToBook });
});

//reset all booking
app.post('/reset', async (req, res)=>{
  await Seat.updateMany({}, { booked: false, bookedBy: null });
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));

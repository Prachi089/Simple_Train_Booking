# 🚆 Train Seat Booking App

This is a full-stack Train Seat Booking application built with React, Node.js, and MongoDB. It allows users to sign up, log in, and book up to 7 seats at a time. The booking logic prioritizes seating in the same row. If not possible, it books the nearest available seats.

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose

---

## 🎯 Features

- 🔐 User Signup and Login (no middleware, simple logic)
- 🪑 Book up to 7 seats at once
- ✅ Seats are booked in the same row if available
- 🔄 If not available, closest available seats are selected
- 🎨 Seats are color-coded:
  - 🟢 Green: Available
  - 🔴 Red: Booked by others
  - 🔵 Blue: Booked by you
- 🧹 Reset all bookings
- 🧮 Shows total booked and available seats in real-time


## Happy Coding


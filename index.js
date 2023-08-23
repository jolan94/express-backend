const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const rooms = [];
const bookings = [];

// Endpoint to create a room
app.post('/api/rooms', (req, res) => {
  const newRoom = {
    id: `room${rooms.length + 1}`,
    name: req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price_per_hour: req.body.price_per_hour,
  };
  rooms.push(newRoom);
  res.json({ id: newRoom.id, message: 'Room created successfully' });
});

// Endpoint to book a room
app.post('/api/bookings', (req, res) => {
  const newBooking = {
    booking_id: `booking${bookings.length + 1}`,
    customer_name: req.body.customer_name,
    room_id: req.body.room_id,
    date: req.body.date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  };
  bookings.push(newBooking);
  res.json({
    booking_id: newBooking.booking_id,
    message: 'Booking successful',
  });
});

// Endpoint to list all rooms with booked data
app.get('/api/rooms/bookings', (req, res) => {
  const roomsWithBookings = rooms.map((room) => ({
    room_name: room.name,
    bookings: bookings.filter((booking) => booking.room_id === room.id),
  }));
  res.json(roomsWithBookings);
});

// Endpoint to list customers with booked data
app.get('/api/customers/bookings', (req, res) => {
  const customersWithBookings = [];
  bookings.forEach((booking) => {
    const customerIndex = customersWithBookings.findIndex(
      (c) => c.customer_name === booking.customer_name
    );
    if (customerIndex === -1) {
      customersWithBookings.push({
        customer_name: booking.customer_name,
        bookings: [{ room_name: getRoomName(booking.room_id), ...booking }],
      });
    } else {
      customersWithBookings[customerIndex].bookings.push({
        room_name: getRoomName(booking.room_id),
        ...booking,
      });
    }
  });
  res.json(customersWithBookings);
});

function getRoomName(roomId) {
  const room = rooms.find((r) => r.id === roomId);
  return room ? room.name : 'Unknown Room';
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

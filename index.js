const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

// -----------------------------
// EVENT DATA
// -----------------------------

const events = [
  {
    id: 1,
    name: "Sri Krishna Temple Special Pooja",
    location: "Udupi",
    date: "2026-08-20",
    session: "9:00 AM - 10:00 AM",
    capacity: 200,
    description: "Special morning pooja and darshan."
  },
  {
    id: 2,
    name: "Temple Cultural Festival",
    location: "Mangalore",
    date: "2026-08-25",
    session: "10:00 AM - 12:00 PM",
    capacity: 100,
    description: "Traditional cultural and devotional event."
  },
  {
    id: 3,
    name: "Evening Temple Darshan",
    location: "Mangalore",
    date: "2026-08-30",
    session: "5:00 PM - 7:00 PM",
    capacity: 150,
    description: "Evening darshan session for visitors."
  }
];

// Temporary in-memory booking storage
let bookings = [];

// -----------------------------
// MIDDLEWARE
// -----------------------------

app.use(cors());
app.use(express.json());

// -----------------------------
// TEST API
// -----------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Temple Booking API is running"
  });
});

// -----------------------------
// GET ALL EVENTS
// -----------------------------

app.get("/api/events", (req, res) => {
  res.status(200).json(events);
});

// -----------------------------
// GET EVENT BY ID
// -----------------------------

app.get("/api/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id);

  const event = events.find(
    (event) => event.id === eventId
  );

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  res.status(200).json(event);
});

// -----------------------------
// CREATE BOOKING
// -----------------------------

app.post("/api/bookings", (req, res) => {
  const {
    visitorName,
    contact,
    numberOfVisitors,
    eventId
  } = req.body;

  if (
    !visitorName ||
    !contact ||
    !numberOfVisitors ||
    !eventId
  ) {
    return res.status(400).json({
      error: "All booking fields are required"
    });
  }

  if (numberOfVisitors <= 0) {
    return res.status(400).json({
      error: "Number of visitors must be greater than 0"
    });
  }

  const event = events.find(
    (event) => event.id === parseInt(eventId)
  );

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  if (numberOfVisitors > event.capacity) {
    return res.status(400).json({
      error: "Number of visitors exceeds event capacity"
    });
  }

  const booking = {
    id: bookings.length + 1,
    visitorName,
    contact,
    numberOfVisitors,
    eventId: parseInt(eventId),
    status: "CONFIRMED"
  };

  bookings.push(booking);

  res.status(201).json({
    message: "Booking created successfully",
    booking
  });
});

// -----------------------------
// GET ALL BOOKINGS
// -----------------------------

app.get("/api/bookings", (req, res) => {
  res.status(200).json(bookings);
});

// -----------------------------
// GET BOOKING BY ID
// -----------------------------

app.get("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);

  const booking = bookings.find(
    (booking) => booking.id === bookingId
  );

  if (!booking) {
    return res.status(404).json({
      error: "Booking not found"
    });
  }

  res.status(200).json(booking);
});

// -----------------------------
// UPDATE BOOKING
// -----------------------------

app.put("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);

  const booking = bookings.find(
    (booking) => booking.id === bookingId
  );

  if (!booking) {
    return res.status(404).json({
      error: "Booking not found"
    });
  }

  if (booking.status === "CANCELLED") {
    return res.status(400).json({
      error: "Cancelled booking cannot be updated"
    });
  }

  const {
    visitorName,
    contact,
    numberOfVisitors,
    eventId
  } = req.body;

  if (
    !visitorName ||
    !contact ||
    !numberOfVisitors ||
    !eventId
  ) {
    return res.status(400).json({
      error: "All booking fields are required"
    });
  }

  if (numberOfVisitors <= 0) {
    return res.status(400).json({
      error: "Number of visitors must be greater than 0"
    });
  }

  const event = events.find(
    (event) => event.id === parseInt(eventId)
  );

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  if (numberOfVisitors > event.capacity) {
    return res.status(400).json({
      error: "Number of visitors exceeds event capacity"
    });
  }

  booking.visitorName = visitorName;
  booking.contact = contact;
  booking.numberOfVisitors = numberOfVisitors;
  booking.eventId = parseInt(eventId);

  res.status(200).json({
    message: "Booking updated successfully",
    booking
  });
});

// -----------------------------
// CANCEL BOOKING
// -----------------------------

app.delete("/api/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);

  const booking = bookings.find(
    (booking) => booking.id === bookingId
  );

  if (!booking) {
    return res.status(404).json({
      error: "Booking not found"
    });
  }

  if (booking.status === "CANCELLED") {
    return res.status(400).json({
      error: "Booking is already cancelled"
    });
  }

  booking.status = "CANCELLED";

  res.status(200).json({
    message: "Booking cancelled successfully",
    booking
  });
});

// -----------------------------
// START SERVER
// -----------------------------

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});
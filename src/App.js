import React, { useEffect, useState } from "react";
import "./App.css";
import krishnaImage from "./krishna.webp";
import Temple1Image from  "./kateel.webp";
import Temple2Image from "./kudroli.webp";



const API_URL = "http://localhost:4000/api";

function App() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");

  const [visitorName, setVisitorName] = useState("");
  const [contact, setContact] = useState("");
  const [numberOfVisitors, setNumberOfVisitors] = useState(1);

  // Load events
  const loadEvents = async () => {
    const response = await fetch(`${API_URL}/events`);
    const data = await response.json();

    setEvents(data);
  };

  // Load bookings
  const loadBookings = async () => {
    const response = await fetch(`${API_URL}/bookings`);
    const data = await response.json();

    setBookings(data);
  };

  useEffect(() => {
    loadEvents();
    loadBookings();
  }, []);

  // Select event from card
  const selectEvent = (eventId) => {
    setSelectedEvent(eventId);
  };

  // Submit booking
  const submitBooking = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      selectedEvent === "" ||
      visitorName.trim() === "" ||
      contact.trim() === "" ||
      numberOfVisitors < 1
    ) {
      alert("Please fill all booking details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(contact)) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    const bookingData = {
      visitorName: visitorName,
      contact: contact,
      numberOfVisitors: Number(numberOfVisitors),
      eventId: Number(selectedEvent)
    };

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();

    if (response.ok) {
      alert("Booking confirmed!");

      setVisitorName("");
      setContact("");
      setNumberOfVisitors(1);
      setSelectedEvent("");

      loadBookings();
    } else {
      alert(data.error || "Booking failed.");
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Booking cancelled.");
      loadBookings();
    }
  };

  // Get event information for a booking
  const getEvent = (eventId) => {
    return events.find((event) => event.id === eventId);
  };

  // Temple images
  const eventImages = [
    krishnaImage,
    Temple1Image,
    Temple2Image
  ];

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo-section">
          <div className="temple-icon">  </div>

          <h1>Temple Crowd Booking System</h1>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#bookings">My Bookings</a>
        </nav>
      </header>


      {/* HERO SECTION */}
      <section className="hero" id="home">

        <div className="hero-content">
          <h2>Welcome Devotee!</h2>

          <p>
            Book your temple visit and manage your bookings easily.
          </p>
        </div>

      </section>


      {/* MAIN CONTENT */}
      <main className="main-container">

        {/* EVENTS SECTION */}
        <section className="events-section" id="events">

          <h2>Available Temple Events</h2>

          <div className="event-cards">

            {events.map((event, index) => (

              <div className="event-card" key={event.id}>

                <img
                  src={eventImages[index % eventImages.length]}
                  alt="Temple"
                />

                <div className="event-details">

                  <h3>{event.name}</h3>

                  <p>
                    <span>📅</span>
                    {event.date}
                  </p>

                  <p>
                    <span>🕐</span>
                    {event.session}
                  </p>

                  <p>
                    <span>📍</span>
                    {event.location}
                  </p>

                  <p>
                    <span>👥</span>
                    Capacity: {event.capacity}
                  </p>

                  <button
                    onClick={() => selectEvent(event.id)}
                    className="book-button"
                  >
                    Book Now
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* BOOKING FORM */}
        <section className="booking-section">

          <div className="booking-header">

            <h2>Book Your Visit</h2>

            <div className="calendar-icon">
              📅
            </div>

          </div>


          <form onSubmit={submitBooking}>

            {/* EVENT */}
            <label>Select Event</label>

            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >

              <option value="">
                -- Select Event --
              </option>

              {events.map((event) => (

                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.name}
                </option>

              ))}

            </select>


            {/* NAME */}
            <label>Visitor Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />


            {/* CONTACT */}
            <label>Contact Number</label>

            <input
              type="text"
              placeholder="Enter 10-digit mobile number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />


            {/* VISITORS */}
            <label>Number of Visitors</label>

            <input
              type="number"
              min="1"
              value={numberOfVisitors}
              onChange={(e) => setNumberOfVisitors(e.target.value)}
            />


            <button
              type="submit"
              className="submit-button"
            >
              Submit Booking
            </button>

          </form>

        </section>


        {/* BOOKINGS */}
        <section
          className="bookings-section"
          id="bookings"
        >

          <h2>My Bookings</h2>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Booking ID</th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Visitors</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {bookings.length === 0 ? (

                  <tr>
                    <td colSpan="7">
                      No bookings found.
                    </td>
                  </tr>

                ) : (

                  bookings.map((booking) => {

                    const event = getEvent(
                      Number(booking.eventId)
                    );

                    return (

                      <tr key={booking.id}>

                        <td>
                          {booking.id}
                        </td>

                        <td>
                          {event
                            ? event.name
                            : "Event"}
                        </td>

                        <td>
                          {event
                            ? event.date
                            : "-"}
                        </td>

                        <td>
                          {event
                            ? event.session
                            : "-"}
                        </td>

                        <td>
                          {booking.numberOfVisitors}
                        </td>

                        <td>

                          <span
                            className={
                              booking.status === "CANCELLED"
                                ? "status cancelled"
                                : "status confirmed"
                            }
                          >
                            {booking.status || "CONFIRMED"}
                          </span>

                        </td>

                        <td>

                          {booking.status !== "CANCELLED" ? (

                            <button
                              className="cancel-button"
                              onClick={() =>
                                cancelBooking(booking.id)
                              }
                            >
                              Cancel
                            </button>

                          ) : (

                            <span>-</span>

                          )}

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer>

        © 2026 Temple Crowd Booking System.
        All rights reserved.

      </footer>

    </div>
  );
}

export default App;


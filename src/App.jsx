import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import EventDetails from "./EventDetails";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

//stats: average, lowest price, num of events
//filter: NYC only
//NY only
//concert only

function App() {
  const [events, setEvents] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [highestPrice, setHighestPrice] = useState(0);
  const [search, setsearch] = useState("");
  const [showNYEvents, setShowNYEvents] = useState(false);
  const [showConcerts, setShowConcerts] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://api.seatgeek.com/2/events?client_id=${ACCESS_KEY}&per_page=250`
      )
      .then((response) => {
        console.log(response.data.events);
        setEvents(response.data.events);
        const avgPrices = response.data.events.map(
          (event) => event.stats.average_price
        );
        const sum = avgPrices.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / response.data.events.length;
        setAveragePrice(avg.toFixed(2));
        const highestPrices = response.data.events
          .map((event) => event.stats.highest_price)
          .filter((number) => number !== null);
        const highPrice = Math.max(...highestPrices);
        setHighestPrice(highPrice);
      })
      .catch((error) => console.log(error));
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  const nyEvents = filteredEvents.filter((event) => event.venue.state === "NY");

  const showFilteredEvents = showNYEvents ? nyEvents : filteredEvents;

  const showConcertEvents = showConcerts
    ? showFilteredEvents.filter((event) => event.type === "concert")
    : showFilteredEvents;

  const datas = [
    { id: 1, title: "Jaguars 1-B", date: "2022-05-01", participants: 50 },
    { id: 2, title: "Buckcherry", date: "2022-06-01", participants: 70 },
    {
      id: 3,
      title: "Fozzy",
      date: "2022-07-01",
      participants: 40,
    },
    { id: 4, title: "Gerry Dee", date: "2022-08-01", participants: 90 },
    { id: 5, title: "Casting Crowns", date: "2022-09-01", participants: 60 },
  ];

  const data = datas.map((event) => ({
    title: event.title,
    participants: event.participants,
  }));

  return (
    <div>
      <div className="stats">
        <h2 style={{ color: "green" }}>
          Average Price of all events: ${averagePrice}
        </h2>
        <h2 style={{ color: "yellow" }}>
          Total number of all events: {events.length}
        </h2>
        <h2 style={{ color: "red" }}>
          Highest Price of all events: ${highestPrice}
        </h2>
      </div>
      <h2>Events Data Visualization Participants</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="participants" fill="#8884d8" />
      </BarChart>
      <div className="data">
        <input
          type="text"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search events by title"
        />
        <button onClick={() => setShowNYEvents(!showNYEvents)}>
          {showNYEvents ? "Show All Events" : "Show NY Events"}
        </button>
        <button onClick={() => setShowNYEvents(!showNYEvents)}>
          {showNYEvents ? "Show All Events" : "Show NYC Events"}
        </button>
        <button onClick={() => setShowConcerts(!showConcerts)}>
          {showConcerts ? "Show All Events" : "Show Concerts"}
        </button>
        {showFilteredEvents.length > 0 ? (
          showFilteredEvents.map((event) => (
            <div key={event.id}>
              <Link to={`/EventDetails/${event.id}`}>
                <h2>{event.title}</h2>
              </Link>
              <p>
                Average Price:{" "}
                {event.stats.average_price
                  ? `$${event.stats.average_price}`
                  : "None"}
              </p>
              <p>
                Highest Price:{" "}
                {event.stats.highest_price
                  ? `$${event.stats.highest_price}`
                  : "None"}
              </p>
              <p>
                Lowest Price:{" "}
                {event.stats.lowest_price
                  ? `$${event.stats.lowest_price}`
                  : "None"}
              </p>
              <p>
                {event.venue.name}, {event.venue.city}, {event.venue.state}
              </p>
              <p>{event.datetime_local}</p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
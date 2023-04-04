import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Outlet, Link } from "react-router-dom";
import App from "./App";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.seatgeek.com/2/events/${eventId}?client_id=${ACCESS_KEY}`
      )
      .then((response) => {
        console.log(response.data);
        setEvent(response.data);
      })
      .catch((error) => console.log(error));
  }, [eventId]);

  return (
    <div>
      {event ? (
        <div>
          <h2>{event.title}</h2>
          <p>{event.datetime_local}</p>
          <p>
            {event.venue.name}, {event.venue.city}, {event.venue.state}
          </p>
          <p>
            Average Price:{" "}
            {event.stats.average_price
              ? `$${event.stats.average_price}`
              : "None"}
          </p>
          <p>
            Lowest Price:{" "}
            {event.stats.lowest_price ? `$${event.stats.lowest_price}` : "None"}
          </p>
          <p>
            Highest Price:{" "}
            {event.stats.highest_price
              ? `$${event.stats.highest_price}`
              : "None"}
          </p>
        </div>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
}

export default EventDetails;

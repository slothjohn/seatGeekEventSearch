import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import EventDetails from "./EventDetails";


ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/EventDetails/:eventId" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
);

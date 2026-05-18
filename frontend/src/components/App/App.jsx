import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SavedNews from "../SavedNews/SavedNews";

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <h1>News Explorer</h1>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saved-news" element={<SavedNews />} />
      </Routes>
    </BrowserRouter>
  );
}
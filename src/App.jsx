import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Start from "./pages/Start"
import Companies from "./pages/Companies";
import Order from "./pages/Order";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Start/>} />
        <Route path="/foretag" element={<Companies/>} />
        <Route path="/bestall" element={<Order/>} />
        <Route path="/omoss" element={<About/>} />
        <Route path="/kontakt" element={<Contact/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;





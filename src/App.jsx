import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import ResumeForm from "./pages/ResumeForm";
import Preview from "./pages/Preview";
import ResumesList from "./pages/ResumesList";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<ResumeForm />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/resumes" element={<ResumesList />} />
      </Routes>
      <Footer /> 
    </BrowserRouter>
  );
}

export default App;
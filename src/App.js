import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Timer from "./pages";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Timer />} />
            </Routes>
        </Router>
    );
}

export default App;

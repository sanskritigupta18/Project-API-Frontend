import "./App.css";
import { Routes, Route, Navigate, Router} from "react-router-dom"
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import ManageProject from "./components/ManageProject";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/project/:id" element={<ManageProject />} /> {/* For editing project */}
        <Route path="/add-project" element={<ManageProject />} /> {/* For adding new project */}
        <Route path="/user" element={<UserProfile/>} />
        <Route path="/" element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;

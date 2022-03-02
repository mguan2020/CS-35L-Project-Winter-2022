import "./App.css";
import JoinChat from "./JoinChat";
import Sidebar from "./Sidebar";
import Register from "./Register";


function App() {
    return (
        <div className="main">
            <div className="left">
                <Sidebar />
            </div>
            <div className="middle">
                <JoinChat />
            </div>
            <div className="right">
                <Register />
            </div>
        </div>
    );
}

export default App;

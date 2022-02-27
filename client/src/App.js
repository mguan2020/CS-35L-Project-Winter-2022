import "./App.css";
import JoinChat from "./JoinChat";
import Sidebar from "./Sidebar";


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
            </div>
        </div>
    );
}

export default App;

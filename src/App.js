// import logo from "./logo.svg";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Home from "./component/Home";
import Navbaar from "./component/Navbaar";
import Footer from "./component/Footer";

function App() {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Navbaar />
        <div className="flex-grow-1">
          <Home />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;

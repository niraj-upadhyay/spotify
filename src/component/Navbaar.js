import React from "react";
import logo from "../logo/spotify.png";

const Navbaar = () => {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg sticky-top"
        style={{ backgroundColor: "#4C4C6D" }}
      >
        <div className="container-fluid d-flex align-items-center">
          <img src={logo} alt="Navbaar Logo" style={{ height: "40px" }} />
          <h6 className="text-white ms-2 mb-0 me-auto">spotify</h6>
        </div>
      </nav>
    </>
  );
};

export default Navbaar;

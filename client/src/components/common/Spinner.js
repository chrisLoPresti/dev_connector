import React from "react";

const Spinner = () => {
  return (
    <div>
      <img
        src={require("./spinner.gif")}
        alt="loading..."
        style={{ width: "50px", margin: "auto", display: "block" }}
      />
    </div>
  );
};

export default Spinner;

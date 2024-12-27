import React, { useState } from "react";

export default function TextForm(props) {
  const [text, setText] = useState("");

  const handleOnChange = (event) => {
    console.log("On change " + text);
    setText(event.target.value);
  };

  const handleUpClick = () => {
    console.log("clicked");
    let newText = text.toUpperCase();
    setText(newText);
  };

  return (
    <>
    <div>
      <h1>{props.heading} </h1>
      <div className="mb-3 my-3">
        <textarea
          className="form-control"
          value={text}
          onChange={handleOnChange}
          id="myBox"
          rows="8"
        ></textarea>
      </div>
      <button className="btn btn-primary mx-2" onClick={handleUpClick}>
        Convert to upper case
      </button>
      <button className="btn btn-primary mx-2" onClick={handleUpClick}>
        Convert to upper case
      </button>
    </div>

    <div className="container my-3">
      <h2>Your text summary</h2>
      <p>{text.split(" ").length} words and {text.length} characters</p>
      <p>{0.008*text.split(" ").length} Minutes to read</p>
      <h2>Preview</h2>
      <p>{text}</p>
    </div>
    </>
  );
}

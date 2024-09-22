import React, { useState } from "react";
import { TextField, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";

import "./App.css";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data) {
        throw new Error('Invalid JSON: "data" field is required');
      }

      const response = await axios.post(
        "http://localhost:4000/bfhl",
        parsedJson
      );
      setResponseData(response.data);
    } catch (err) {
      console.log(err);
      setError("Invalid JSON or failed to connect to the backend.");
    }
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOptions(value);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    let filteredResponse = {
      alphabets: [],
      numbers: [],
      highest_lowercase_alphabet: [],
    };

    if (selectedOptions.includes("Alphabets")) {
      filteredResponse.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes("Numbers")) {
      filteredResponse.numbers = responseData.numbers;
    }
    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      filteredResponse.highest_lowercase_alphabet =
        responseData.highest_lowercase_alphabet;
    }

    // Create a formatted string
    const formattedResponse = `
      Numbers: ${filteredResponse.numbers.join(", ")}
      Alphabets: ${filteredResponse.alphabets.join(", ")}
      Highest Lowercase Alphabet: ${filteredResponse.highest_lowercase_alphabet.join(
        ", "
      )}
    `;

    return (
      <div>
        {/* <pre>{JSON.stringify(filteredResponse, null, 2)}</pre> */}
        <div style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
          <strong>Formatted Output:</strong>
          <p>{formattedResponse}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <TextField
        label="Enter valid JSON"
        variant="outlined"
        multiline
        rows={4}
        value={jsonInput}
        onChange={handleJsonChange}
        fullWidth
        margin="normal"
        error={!!error}
        helperText={error && "Invalid JSON format"}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        style={{ borderRadius: "8px", marginBottom: "20px" }}
      >
        Submit
      </Button>

      {responseData && (
        <>
          <h2>Select Data to Display</h2>
          <Select
            multiple
            value={selectedOptions}
            onChange={handleOptionChange}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <span
                    key={value}
                    style={{
                      margin: "2px",
                      padding: "5px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "5px",
                    }}
                  >
                    {value}
                  </span>
                ))}
              </div>
            )}
          >
            <MenuItem value="Alphabets">Alphabets</MenuItem>
            <MenuItem value="Numbers">Numbers</MenuItem>
            <MenuItem value="Highest Lowercase Alphabet">
              Highest Lowercase Alphabet
            </MenuItem>
          </Select>
          {renderResponse()}
        </>
      )}
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';

function App() {
  const [option, setOption] = useState(''); // Default to empty option
  const [kg, setKg] = useState('');
  const [weights, setWeights] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customOptions, setCustomOptions] = useState({}); // Store custom options
  const [showCustomOptionForm, setShowCustomOptionForm] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [newValue, setNewValue] = useState('');

  // Load custom options and weights from localStorage on component mount
  useEffect(() => {
    const savedWeights = JSON.parse(localStorage.getItem('weights')) || [];
    setWeights(savedWeights);

    const savedCustomOptions = JSON.parse(localStorage.getItem('customOptions')) || {};
    setCustomOptions(savedCustomOptions);
  }, []);

  // Handle the option change
  const handleOptionChange = (e) => {
    setOption(e.target.value);
  };

  // Handle the kg input change
  const handleKgChange = (e) => {
    setKg(e.target.value);
  };

  // Submit the weight for the selected option
  const handleSubmit = () => {
    if (!kg || isNaN(kg) || kg <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    // Create a new record with the selected option, kg, and timestamp
    const newRecord = {
      option,
      kg: parseFloat(kg),
      timestamp: new Date().toLocaleString(),
    };

    // Add the new record to the list and update localStorage
    const updatedWeights = [...weights, newRecord];
    localStorage.setItem('weights', JSON.stringify(updatedWeights));
    setWeights(updatedWeights);
    setKg('');
    alert('Weight saved successfully!');
  };

  // Calculate the bill based on custom options
  const handleBillCalculation = () => {
    let total = 0;

    // Calculate the total by multiplying kg by price for each option
    weights.forEach((record) => {
      const price = customOptions[record.option] || 0; // Use custom price or default 0
      total += record.kg * price;
    });

    // Update the total amount
    setTotalAmount(total);
  };

  // Clear everything except the option and custom options
  const handleClear = () => {
    // Clear state values except the option
    setKg('');
    setWeights([]);
    setTotalAmount(0);
    
    // Clear localStorage except the custom options and the selected option
    localStorage.removeItem('weights');
    localStorage.removeItem('totalAmount');

    alert('Data cleared (excluding the selected option).');
  };

  // Function to add custom options
  const handleAddCustomOption = () => {
    if (newOption && newValue && !isNaN(newValue) && newValue > 0) {
      // Update the customOptions state
      const updatedOptions = { ...customOptions, [newOption]: parseFloat(newValue) };
      setCustomOptions(updatedOptions);

      // Store the updated custom options in localStorage
      localStorage.setItem('customOptions', JSON.stringify(updatedOptions));

      setNewOption('');
      setNewValue('');
      setShowCustomOptionForm(false); // Hide the form after submission
      alert('Custom option added successfully!');
    } else {
      alert('Please enter a valid option and price.');
    }
  };

  // Function to generate PDF for the weights and calculation
  const handlePrint = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title
    doc.setFontSize(16);
    doc.text("Billing Report", 105, yPosition, { align: "center" });
    yPosition += 10;

    // Table Header
    doc.setFontSize(12);
    doc.text("Option", 20, yPosition);
    doc.text("Total Kg", 80, yPosition);
    doc.text("Total Amount", 150, yPosition);
    yPosition += 10;

    // Grouped weights by option
    const groupedWeights = weights.reduce((groups, weight) => {
      if (!groups[weight.option]) {
        groups[weight.option] = [];
      }
      groups[weight.option].push(weight);
      return groups;
    }, {});

    // Add records for each option and calculate totals
    const prices = customOptions; // Prices from custom options
    let overallTotalKg = 0;
    let overallTotalAmount = 0;

    Object.keys(groupedWeights).forEach((option) => {
      let totalKg = 0;
      let totalAmount = 0;
      
      groupedWeights[option].forEach((record) => {
        const amount = record.kg * (prices[record.option] || 0);
        totalKg += record.kg;
        totalAmount += amount;

        // Add Record to PDF
        doc.text(record.option, 20, yPosition);
        doc.text(record.kg.toFixed(2), 80, yPosition);
        doc.text(amount.toFixed(2), 150, yPosition);
        yPosition += 6;
      });

      // Add Option Totals
      doc.text(`${option} Total:`, 20, yPosition);
      doc.text(`Kg: ${totalKg.toFixed(2)}`, 80, yPosition);
      doc.text(`Amount: ${totalAmount.toFixed(2)}`, 150, yPosition);
      yPosition += 10;

      // Add to Overall Totals
      overallTotalKg += totalKg;
      overallTotalAmount += totalAmount;
    });

    // Add Overall Totals
    doc.setFontSize(14);
    doc.text("Overall Totals:", 20, yPosition);
    doc.text(`Total Kg: ${overallTotalKg.toFixed(2)}`, 80, yPosition);
    doc.text(`Total Amount: ${overallTotalAmount.toFixed(2)}`, 150, yPosition);
    
    // Save PDF
    doc.save('billing-report.pdf');
  };

  return (
    <div className="App">
      <h1>Weight Selection</h1>
<hr />
      <div className="group group1">
        <div className="form-group">
          <label>Select Option: </label>
          <select value={option} onChange={handleOptionChange}>
            <option value="">Select an option</option>
            {Object.keys(customOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Enter Weight (kg): </label>
          <input
            type="number"
            value={kg}
            onChange={handleKgChange}
            placeholder="Enter kg"
          />
        </div>

        <div className="button-container">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          <button className="clear-btn" onClick={handleClear}>Clear All</button>
        </div>
      </div>
<hr />
      <div className="group group2">
        <h2>Bill Calculation</h2>
        <button className="bill-btn" onClick={handleBillCalculation}>Calculate Bill</button>

        <h3>Total: {totalAmount}</h3>
      </div>
<hr />
      <div className="stored-weights">
        <h2>Stored Weights:</h2>

        {weights.map((record, index) => (
          <div key={index} className="record-card">
            <div className="record-header">
              <strong>{record.option}</strong>
              <span className="timestamp">{record.timestamp}</span>
            </div>
            <div className="record-body">
              <span className="weight">{record.kg} kg</span>
            </div>
          </div>
        ))}
      </div>
<hr />
      {/* Download PDF Button */}
      <div className="pdf-container">
        <button className="pdf-btn" onClick={handlePrint}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default App;

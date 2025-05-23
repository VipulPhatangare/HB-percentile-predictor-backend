const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database for historical data (in a real app, use a proper database)
const historicalData = {
    "2025-04-19": {
        "1": { minScore: 180, maxScore: 200, avgScore: 190 },
        "2": { minScore: 175, maxScore: 195, avgScore: 185 }
    },
    // Add data for other dates...
};

// API endpoint for percentile calculation
app.post('/api/calculate-percentile', (req, res) => {
    const { mathMarks, physicsMarks, chemistryMarks, examDate, shift } = req.body;
    
    // Validate inputs
    if (mathMarks < 0 || mathMarks > 100 || 
        physicsMarks < 0 || physicsMarks > 50 || 
        chemistryMarks < 0 || chemistryMarks > 50 ||
        !examDate || !shift) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    // Calculate total marks (scaled to 200)
    const totalMarks = mathMarks + (physicsMarks * 2) + (chemistryMarks * 2);
    
    // Get historical data for this date and shift
    const historical = historicalData[examDate]?.[shift] || 
                     { minScore: 120, maxScore: 200, avgScore: 160 };
    
    // Calculate percentile (simplified for demo)
    let percentile = 0;
    const range = historical.maxScore - historical.minScore;
    
    if (range > 0) {
        percentile = ((totalMarks - historical.minScore) / range) * 100;
    }
    
    // Adjust percentile to be realistic
    percentile = Math.min(100, Math.max(0, percentile));
    percentile = percentile * 0.9 + (Math.random() * 5); // Add some randomness
    
    // Return the result
    res.json({
        percentile,
        totalMarks,
        mathMarks,
        physicsMarks,
        chemistryMarks,
        examDate,
        shift
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
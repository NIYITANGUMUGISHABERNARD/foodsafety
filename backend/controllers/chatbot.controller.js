const axios = require("axios");

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        // Call Python service
        const pythonResponse = await axios.post('http://localhost:5001/chat', {
            message: message
        });

        res.json({ response: pythonResponse.data.response });

    } catch (err) {
        console.error("Chatbot error:", err);
        
        // Fallback to simple response if Python service is unavailable
        if (err.code === 'ECONNREFUSED') {
            res.json({ 
                response: "Python chatbot service is not running. Please start the Python service on port 5001.\n\nTo start: cd python-service && python app.py" 
            });
        } else {
            res.status(500).json({ response: "Sorry, I encountered an error. Please try again." });
        }
    }
};

// API Endpoint to get employees
app.get('/api/employees', async (req, res) => {
    try {
        console.log('Fetching employees from MongoDB...');
        const employees = await Employee.find({});
        console.log('Found employees:', employees);
        console.log('Connection state:', mongoose.connection.readyState);
        res.json(employees);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

// Also add this near the top to check MongoDB connection
employeeConnection.on('connected', () => {
    console.log('Connected to employee database');
});

employeeConnection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

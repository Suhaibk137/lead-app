const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['https://lead-app-three.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

console.log('Attempting to connect to MongoDB databases...');

// Create separate connections for each database
const employeeConnection = mongoose.createConnection(process.env.EMPLOYEE_DB_URI);
const leadConnection = mongoose.createConnection(process.env.LEAD_DB_URI);

employeeConnection.on('connected', () => {
    console.log('Connected to employee database');
});

employeeConnection.on('error', (err) => {
    console.error('Employee database connection error:', err);
});

leadConnection.on('connected', () => {
    console.log('Connected to lead database');
});

leadConnection.on('error', (err) => {
    console.error('Lead database connection error:', err);
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
    name: String,
    emCode: String,
    email: String,
    position: String
}, { collection: 'elite-employee-mail-codes' });

const Employee = employeeConnection.model('Employee', employeeSchema);

// Lead Schema
const leadSchema = new mongoose.Schema({
    employeeName: String,
    employeeCode: String,
    contactName: String,
    contactNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'daily-data' });

const Lead = leadConnection.model('Lead', leadSchema);

// API Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// API Endpoint to get employees
app.get('/api/employees', async (req, res) => {
    try {
        console.log('Fetching employees...');
        const employees = await Employee.find({});
        console.log('Found employees:', employees);
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: error.message });
    }
});

// API Endpoint to save lead
app.post('/api/leads', async (req, res) => {
    try {
        const { employeeId, contactName, contactNumber } = req.body;
        console.log('Received lead data:', { employeeId, contactName, contactNumber });

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            console.error('Employee not found for ID:', employeeId);
            return res.status(400).json({ message: 'Employee not found' });
        }

        const lead = new Lead({
            employeeName: employee.name,
            employeeCode: employee.emCode,
            contactName,
            contactNumber,
            date: new Date()
        });

        const savedLead = await lead.save();
        console.log('Lead saved successfully:', savedLead);
        res.status(201).json(savedLead);
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ message: error.message });
    }
});

// API Endpoint to get today's leads for an employee
app.get('/api/leads/:employeeId', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.employeeId);
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log('Fetching leads for employee:', employee.name);
        const leads = await Lead.find({
            employeeCode: employee.emCode,
            date: { $gte: today }
        }).sort({ date: -1 });
        
        console.log('Found leads:', leads.length);
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ message: error.message });
    }
});

// For local development
if (process.env.NODE_ENV

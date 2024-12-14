// Load employees into dropdown
async function loadEmployees() {
    try {
        console.log('Fetching employees...');
        const response = await fetch('/api/employees');
        console.log('Response status:', response.status);
        const employees = await response.json();
        console.log('Employees data:', employees);
        
        const employeeSelect = document.getElementById('employee');
        employeeSelect.innerHTML = '<option value="">Choose employee...</option>';
        
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee._id;
            option.textContent = `${employee.name} (${employee.emCode})`;
            employeeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading employees:', error);
        console.error('Error details:', error.stack);
    }
}

// Format date to local time
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'N/A';
    }
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Load leads for selected employee
async function loadLeads(employeeId) {
    try {
        const response = await fetch(`/api/leads/${employeeId}`);
        const leads = await response.json();
        
        const tbody = document.getElementById('leadsTableBody');
        tbody.innerHTML = '';
        
        leads.forEach(lead => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(lead.date)}</td>
                <td>${lead.contactName || '-'}</td>
                <td>${lead.contactNumber}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading leads:', error);
    }
}

// Handle form submission
document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const employeeId = document.getElementById('employee').value;
    const contactName = document.getElementById('contactName').value;
    const contactNumber = document.getElementById('contactNumber').value;
    
    if (!employeeId) {
        alert('Please select an employee');
        return;
    }
    
    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                employeeId,
                contactName,
                contactNumber
            }),
        });
        
        if (response.ok) {
            // Clear form
            document.getElementById('contactName').value = '';
            document.getElementById('contactNumber').value = '';
            
            // Reload leads
            loadLeads(employeeId);
            
            alert('Lead saved successfully!');
        } else {
            alert('Error saving lead. Please try again.');
        }
    } catch (error) {
        console.error('Error saving lead:', error);
        alert('Error saving lead. Please try again.');
    }
});

// Load leads when employee is selected
document.getElementById('employee').addEventListener('change', (e) => {
    const employeeId = e.target.value;
    if (employeeId) {
        loadLeads(employeeId);
    } else {
        document.getElementById('leadsTableBody').innerHTML = '';
    }
});

// Initial load of employees
document.addEventListener('DOMContentLoaded', loadEmployees);

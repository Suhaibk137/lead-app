// Change all fetch URLs from absolute to relative

const API_URL = ''; // Will be empty for same-domain requests

// Load employees function
async function loadEmployees() {
    try {
        const response = await fetch(`${API_URL}/api/employees`);
        const employees = await response.json();
        
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
        alert('Error loading employee list. Please try again.');
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
        const response = await fetch(`${API_URL}/api/leads`, {
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

// Load leads function
async function loadLeads(employeeId) {
    try {
        const response = await fetch(`${API_URL}/api/leads/${employeeId}`);
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

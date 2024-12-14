async function loadEmployees() {
    try {
        console.log('Fetching employees from:', '/api/employees');
        const response = await fetch(`/api/employees`);
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
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
    }
}

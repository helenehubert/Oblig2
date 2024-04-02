function submitForm() {
    // Extract user input from form
    const statisticVariable = document.getElementById('variabeldropdown').value;
    //const locations = document.getElementById('kommunedropdown').value.split(','); // Split if multiple locations
    
}

function displayResults(results) {
    const table = document.getElementById('resultsTable');
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows

    for (const [statistic, value] of Object.entries(results)) {
        const row = `<tr><td>${statistic}</td><td>${value}</td></tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    }
}

displayResults(ClientSideResults);        
  
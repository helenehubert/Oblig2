function submitForm() {
    // Extract user input from form
    const statisticVariable = document.getElementById('variabeldropdown').value;
    //const locations = document.getElementById('kommunedropdown').value.split(','); // Split if multiple locations
    
}

const url = 'http://localhost:8080/submit-form'; // URL to our server endpoint
const requestData = {
  variable: statisticVariable // Variable to be passed to the server
};
fetch(url, { //use of fetch method to send variable from frontend to backend
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Response from server:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

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
  
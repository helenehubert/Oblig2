// Node imports.
import path from "path";

// Library imports.
import express, { Express, NextFunction, Request, Response, response } from "express";
import axios from 'axios';


// Our Express app.
const app: Express = express();

// Handle JSON in request bodies.
app.use(express.json());

// Serve the client, static enables the app to act like a webserver and send response.
app.use("/", express.static(path.join(__dirname, "../../client/dist")));

// Enable CORS so that we can call the API even from anywhere.
app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  inNext();
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Custom function to calculate median
function calculateMedian(values:any) {
    const sortedValues = values.slice().sort((a:any, b:any) => a - b);
    const middle = Math.floor(sortedValues.length / 2);
      if (sortedValues.length % 2 === 0) {
        return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
      } else {
        return sortedValues[middle];
      }
  }

// ---------- RESTful endpoint operations begin. ----------

// Route to handle incoming form submission from user to our server, and use of axios
//to make a request from our server to SSB API
app.post('/submit-form', async (req,res) => {
  try {
      //Extract user input from request body/form
      const { statisticVariable } = req.body;
        
      // Construct the API request URL based on user input
      const apiEndpoint = 'https://data.ssb.no/api/v0/no/table/11342';
      // Define the query parameters
      const queryParams = {
        "query": [
        {
          "code": "Region",
          "selection": {
          "filter": "vs:Kommune",
          "values": [
            "1539"
          ]
         }
        },
        {
          "code": "ContentsCode",
          "selection": {
          "filter": "item",
          "values": [
            statisticVariable
          ]
         }
        },
        {
          "code": "Tid",
          "selection": {
          "filter": "item",
          "values": [
            "2021", "2022", "2023"
          ]   
         }
        }
        ],
        "response": {
           "format": "json-stat2"
        }
      };
      
      //We construct the API request URL by concatenating 
      //the base API endpoint (apiEndpoint) with query parameters based on the user input.
      //const apiUrl = `${apiEndpoint}?${new URLSearchParams(queryParams)}`;

      // Use Axios to make a request to the SSB API
      const response = await axios.post(apiEndpoint, queryParams)  

      // Process the response data
      const responseData = response.data;
      //console.log(response.data);
         
      // Extract the values for the selected parameter
      // Exctract the value field you want of all the response data you got 
      const parameterValues = responseData.value;

      // Calculate median
      const median = calculateMedian(parameterValues);

      // Calculate average
      const sum = parameterValues.reduce((acc:any, value:any) => acc + value, 0);
      const average = sum / parameterValues.length;

      // Calculate maximum and minimum
      const maximum = Math.max(...parameterValues);
      const minimum = Math.min(...parameterValues);

      // Send the calculated results back to the client
      const ClientSideResults = res.json({ median, average, maximum, minimum });
  } catch (error) {
      console.error('Error handling form submission:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const dataTest = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]


export default function PriceGraph() {
  const searchParams = useSearchParams();
  const From = searchParams.get("From");
  const To = searchParams.get("To");
  const [convertedValue, setConvertedValue] = useState(null);



// Function to add one month to the current date
function addMonth(date) {
  let newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

// Function to format date as YYYY-MM-DD
function formatDate(date) {
  let year = date.getFullYear();
  let month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  return `${month} ${year}`;
}
  
  useEffect(() => {
      // Start date
let startDate = new Date(2000, 0, 1); // January 1, 2000 (months are 0-based)
    const fetchCurrencyData = async () => {
      if (From === "EUR") {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${To}.EUR.SP00.A?startPeriod=2000&detail=full&format=jsondata`
        );
        const data = await getDataFromDB.json();
        const currencyData = Object.values(data.dataSets[0].series)[0]
          .observations;

        const currencyDataArray = Object.entries(currencyData).map(
          ([key, value]) => {
            return value[0];
          }
        );

        const formattedArray = currencyDataArray.map((value, index) => {
          let currentDate = addMonth(new Date(startDate.getTime())); // Get a copy of the start date
          startDate = currentDate; // Update the start date to the new date
          return { date: formatDate(currentDate), value: value };
        });
console.log("this is entered in EUR",formattedArray);

        setConvertedValue(formattedArray);
      } else if(To === "EUR") {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${From}.EUR.SP00.A?startPeriod=2000&detail=full&format=jsondata`
        );
        const data = await getDataFromDB.json();
        const currencyData = Object.values(data.dataSets[0].series)[0]
          .observations;

        const currencyDataArray = Object.entries(currencyData).map(
          ([key, value]) => {
            return value[0];
          }
        );

        const formattedArray = currencyDataArray.map((value, index) => {
          let currentDate = addMonth(new Date(startDate.getTime())); // Get a copy of the start date
          startDate = currentDate; // Update the start date to the new date
          return { date: formatDate(currentDate), value: 1/value };
        });

        setConvertedValue( formattedArray);
      }
      else {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${From}.EUR.SP00.A?startPeriod=2000&detail=full&format=jsondata`
        );
        const dataFrom = await getDataFromDB.json();
        const currencyDataFrom = Object.values(dataFrom.dataSets[0].series)[0]
          .observations;

        const currencyDataArrayFrom = Object.entries(currencyDataFrom).map(
          ([key, value]) => {
            return value[0];
          }
        );

        const getDataToDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${To}.EUR.SP00.A?startPeriod=2000&detail=full&format=jsondata`
        );
        const dataTo = await getDataToDB.json();
        const currencyDataTo = Object.values(dataTo.dataSets[0].series)[0]
          .observations;
        const currencyDataArrayTo = Object.entries(currencyDataTo).map(
          ([key, value]) => {
            return value[0];
          }
        );
        let currentDate = new Date(2000, 0, 1);
        const dividedArray = currencyDataArrayTo.map((toValue, index) => {
          const fromValue = currencyDataArrayFrom[index];
          return toValue/fromValue
          
        });
        
        const formattedArray = dividedArray.map((value, index) => {
          let currentDate = addMonth(new Date(startDate.getTime())); // Get a copy of the start date
          startDate = currentDate; // Update the start date to the new date
          return { date: formatDate(currentDate), value: value };
        });
        
        setConvertedValue(formattedArray);
      }
    };

    fetchCurrencyData();
  }, [ From, To]);

  return (
    <div>
      PriceGraph Original {From} {To} is 
      <LineChart width={730} height={250} data={convertedValue}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />

  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
    </div>
  );
}

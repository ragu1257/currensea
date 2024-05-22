"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { currencies } from "@/constants/index";
import Image from "next/image";
import "./style.scss"

interface CurrencyData {
  value: string;
  imgURL: string;
  label: string;
  symbol: string;
}

export default function PriceGraph() {
  const searchParams = useSearchParams();
  const Amount = searchParams.get("Amount");
  const From = searchParams.get("From");
  const To = searchParams.get("To");
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>();
  useEffect(() => {
    const fetchCurrencyData = async () => {
      const today = new Date();
      const firstDayCurrentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      firstDayCurrentMonth.setMonth(firstDayCurrentMonth.getMonth() - 1);
      const firstDayLastMonth = new Date(
        firstDayCurrentMonth.getFullYear(),
        firstDayCurrentMonth.getMonth(),
        1
      );
      const year = firstDayLastMonth.getFullYear();
      const month = String(firstDayLastMonth.getMonth() + 1).padStart(2, "0");
      const formattedDate = `${year}-${month}-01`;

      if (From === "EUR") {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${To}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
        );
        const data = await getDataFromDB.json();
        const currencyData = Object.values(data.dataSets[0].series)[0]
          .observations;

        const currencyDataArray = Object.entries(currencyData).map(
          ([key, value]) => {
            return value[0];
          }
        );
        console.log("thisis type of",typeof currencyDataArray[0], typeof Amount);
        
        setConvertedValue((currencyDataArray[0] * parseFloat(Amount)).toFixed(4));
      } else if(To === "EUR") {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${From}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
        );
        const data = await getDataFromDB.json();
        const currencyData = Object.values(data.dataSets[0].series)[0]
          .observations;

        const currencyDataArray = Object.entries(currencyData).map(
          ([key, value]) => {
            return value[0];
          }
        );
        setConvertedValue( Amount/currencyDataArray[0]);
      }
      else {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${From}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
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
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${To}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
        );
        const dataTo = await getDataToDB.json();
        const currencyDataTo = Object.values(dataTo.dataSets[0].series)[0]
          .observations;
        const currencyDataArrayTo = Object.entries(currencyDataTo).map(
          ([key, value]) => {
            return value[0];
          }
        );

        const dividedArray = currencyDataArrayTo.map((toValue, index) => {
          const fromValue = currencyDataArrayFrom[index];
          return toValue / fromValue;
        });
        setConvertedValue(dividedArray[0] * Amount);
      }
    };

    fetchCurrencyData();
    setCurrencyData(currencies.filter((currency) => currency.value === To || currency.value === From ));


  }, [Amount, From, To, convertedValue]);
  
  console.log(currencyData);

  const formatCurrency = (value: number | string | null ) => {
    
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
  }).format(value);
  };
  
  return (
    currencyData &&
    <div className="flex text-light-1 dashboard-current-price">
      <div className="flex dashboard-current-price__image-container">
        <Image className="dashboard-current-price__image-container__image1" src={currencyData[0].imgURL} alt={currencyData[0].value} height={44} width={44}/>
       <Image className="dashboard-current-price__image-container__image2" src={currencyData[1].imgURL} alt={currencyData[1].value} height={44} width={44}/>
      </div>
      <div className="flex">
        
          <span>
          <h1 className="text-2xl">
          {From}
            </h1>
            <h1 className="text-2xl">
            {currencyData[0].symbol} {formatCurrency(Amount)}
            </h1>      
          </span>
          <span className="px-10">
        =
          </span>
          <span>
          <h1 className="text-2xl">
          {To}
            </h1>
            <h1 className="text-2xl">
            {currencyData[1].symbol} {formatCurrency(convertedValue)}
            </h1>      
          </span>

      </div>
    </div>
  );
}

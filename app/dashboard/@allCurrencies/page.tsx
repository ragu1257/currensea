"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { currencies } from "@/constants/index";

export default function PriceGraph() {
  const searchParams = useSearchParams();
  const Amount = searchParams.get("Amount");
  const From = searchParams.get("From");
  const To = searchParams.get("To");
  const [convertedValue, setConvertedValue] = useState(null);

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
        let dataTest = currencies
          .filter(
            (currency) => currency.value !== To && currency.value !== From
          )
          .map(async (currency) => {
            const getDataFromDB = await fetch(
              `https://data-api.ecb.europa.eu/service/data/EXR/M.${currency.value}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
            );

            const data = await getDataFromDB.json();
            const currencyData = Object.values(data.dataSets[0].series)[0]
              .observations;

            const currencyDataArray = Object.entries(currencyData).map(
              ([key, value]) => {
                return value[0];
              }
            );

            return {
              currency: currency.value,
              data: ( currencyDataArray[0]) * Amount,
            };
          });

        const data = await Promise.all(dataTest);
        setConvertedValue(data);
      }  else {
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

let dataTest = currencies
          .filter(
            (currency) => currency.value !== To && currency.value !== From && currency.value !== "EUR"
          )
          .map(async (currency) => {
            const getDataFromDB = await fetch(
              `https://data-api.ecb.europa.eu/service/data/EXR/M.${currency.value}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
            );

            const data = await getDataFromDB.json();
            const currencyData = Object.values(data.dataSets[0].series)[0]
              .observations;

            const currencyDataArray = Object.entries(currencyData).map(
              ([key, value]) => {
                return value[0];
              }
            );

            return {
              currency: currency.value,
              data: ( currencyDataArray[0]/currencyDataArrayFrom[0]) * Amount,
            };
          });

        const data = await Promise.all(dataTest);
        setConvertedValue(data);
      }
    };

    fetchCurrencyData();
  }, [Amount, From, To, convertedValue]);

  return (
    <div className="text-light-1">
      Price All {From}  in 
   
      {convertedValue?.map((currency: any) => {
        return (
          <span key={currency.currency}>
            <div>
              {Amount} {From} = {currency.data} {currency.currency} 
            </div>
  
          </span>
        );
      })}
     
    </div>
  );
}

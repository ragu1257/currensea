"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { currencies } from "@/constants/index";
import "./style.scss";

export default function PriceGraph() {
  const searchParams = useSearchParams();
  const Amount = searchParams.get("Amount");
  const From = searchParams.get("From");
  const To = searchParams.get("To");
  const [convertedValue, setConvertedValue] = useState(null);
  const [cuurentCurrencyURL, setCuurentCurrencyURL] = useState({});

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
              data: currencyDataArray[0] * Amount,
            };
          });

        const data = await Promise.all(dataTest);
        setConvertedValue(data);
      } else {
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
            (currency) =>
              currency.value !== To &&
              currency.value !== From &&
              currency.value !== "EUR"
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

            // const currencyImage = currencies.find(
            //   (currency) => currency.value === currency.value
            // );
            // console.log(currencyImage);
            return {
              currency: currency.value,
              data: (currencyDataArray[0] / currencyDataArrayFrom[0]) * Amount,
              // image: currencyImage?.imgURL,
            };
          });

        const data = await Promise.all(dataTest);
        const updatedData = data.map((currency: any) => {
          const currencyImage = currencies.find(
            (c) => c.value === currency.currency
          );
          return {
            ...currency,
            image: currencyImage?.imgURL,
            symbol: currencyImage?.symbol,
            value: currencyImage?.value,
          };
        });
        setConvertedValue(updatedData);

        // setConvertedValue(data);
      }
    };

    fetchCurrencyData();
    setCuurentCurrencyURL(
      currencies.find((currency) => currency.value === From) ?? ""
    );
  }, [Amount, From, To]);

  const formatCurrency = (value: number | string | null ) => {
    
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(value);
  };

  if (!Amount || !From || !To || parseFloat(Amount) < 1 || !currencies.find(currency => currency.value === From) || !currencies.find(currency => currency.value === To)){
    return null
 }


  return (
    <div className=" text-light-1 all-currencies-price">
      {convertedValue?.map((currency: any) => {
        return (
          <span className="flex p-5 mr-8" key={currency.currency}>
            <div className="flex all-currencies-price__image-container h-fit">
              {cuurentCurrencyURL && (
                <Image
                className="all-currencies-price__image-container__image1" 
                  src={cuurentCurrencyURL.imgURL}
                  alt="currency"
                  width={34}
                  height={34}
                />
              )}
              <Image
              className="all-currencies-price__image-container__image2" 
                src={currency.image}
                alt="currency"
                width={34}
                height={34}
              />
            </div>
            {cuurentCurrencyURL && (
              <div className="flex">
                <span>
                  <h1 className="text-1xl">{From}</h1>
                  <h1 className="text-1xl">
                    {cuurentCurrencyURL.symbol} {formatCurrency(Amount)}
                  </h1>
                </span>
                <span className="px-10">=</span>
                <span>
                  <h1 className="text-1xl">{currency.value}</h1>
                  <h1 className="text-1xl">
                    {currency.symbol} {formatCurrency(currency.data)}
                  </h1>
                </span>
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}

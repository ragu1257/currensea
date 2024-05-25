"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { currencies } from "@/constants/index";
import Image from "next/image";
import "./style.scss";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

        setConvertedValue(
          (currencyDataArray[0] * parseFloat(Amount)).toFixed(4)
        );
      } else if (To === "EUR") {
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
        setConvertedValue(Amount / currencyDataArray[0]);
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
    setCurrencyData(
      currencies
        .filter((currency) => currency.value === From || currency.value === To)
        .sort((a, b) => {
          if (a.value === From) return -1;
          if (b.value === From) return 1;
          return 0;
        })
    );
  }, [Amount, From, To, convertedValue]);

  const formatCurrency = (value: number | string | null) => {
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (!Amount || !From || !To || parseFloat(Amount) < 1 || !currencies.find(currency => currency.value === From) || !currencies.find(currency => currency.value === To)){
    return null
 }
  return (
    currencyData && (
      <>
      <div className="flex text-light-1 dashboard-current-price">
        <div className="flex dashboard-current-price__image-container h-min">
          <Image
            className="dashboard-current-price__image-container__image1"
            src={currencyData[0].imgURL}
            alt={currencyData[0].value}
            height={74}
            width={74}
          />
          <Image
            className="dashboard-current-price__image-container__image2"
            src={currencyData[1].imgURL}
            alt={currencyData[1].value}
            height={74}
            width={74}
          />
        </div>
        <div className="flex ml-5">
          <span>
            <p className="text-4xl">{From}</p>
            <p className="text-4xl">
              {currencyData[0].symbol} {formatCurrency(Amount)}
            </p>
          </span>
          <span className="px-10 text-4xl">=</span>
          <span>
            <p className="text-4xl">{To}</p>
            <p className="text-4xl">
              {currencyData[1].symbol} {formatCurrency(convertedValue)}
            </p>
          </span>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-light-1 text-1xl text-center mb-10">
          Want to get notified when the currency reaches a certain value?
          <div>
          <Dialog>
      <DialogTrigger asChild>
        <Button className="text-dark-1 mt-4" variant="outline">Yes, notify me</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notify me</DialogTitle>
          <DialogDescription>
            when 1 {From} is equal to 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {To}
            </Label>
            <Input
              id="name"
              type="number"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input
              id="username"
              type="email"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
          </div>
        </p>
      </div>
      </>
    )
  );
}

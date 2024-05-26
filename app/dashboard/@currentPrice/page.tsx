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
  const Amount = parseFloat(searchParams.get("Amount") || "0");
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
        const currencyData = data.dataSets[0].series["0:0:0:0:0"].observations["0"][0]

     

        setConvertedValue(
          parseFloat((currencyData * parseFloat(Amount.toString())).toFixed(4))
        );
      } else if (To === "EUR") {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${From}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
        );
        const data = await getDataFromDB.json();
        const currencyData = data.dataSets[0].series["0:0:0:0:0"].observations["0"][0]


 
        setConvertedValue(Amount / currencyData);
      } else {
        const getDataFromDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${From}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
        );
        const dataFrom = await getDataFromDB.json();
        const currencyDataFrom = dataFrom.dataSets[0].series["0:0:0:0:0"].observations["0"][0];



        const getDataToDB = await fetch(
          `https://data-api.ecb.europa.eu/service/data/EXR/M.${To}.EUR.SP00.A?startPeriod=${formattedDate}&detail=full&format=jsondata`
        );
        const dataTo = await getDataToDB.json();
        const currencyDataTo = dataTo.dataSets[0].series["0:0:0:0:0"].observations["0"][0];

        const dividedArray = currencyDataTo/currencyDataFrom 

        setConvertedValue(dividedArray * Amount);
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

  const formatCurrency = (value: number | string | null ) => {
    const numericValue = value ? parseFloat(value.toString()) : 0;
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  };

  if (!Amount || !From || !To || parseFloat(Amount.toString()) < 1 || !currencies.find(currency => currency.value === From) || !currencies.find(currency => currency.value === To)){
    return null
 }
  return (
    currencyData && (
      <>
      <div className="flex text-light-1 max-md:flex-col  dashboard-current-price">
        <div className="flex dashboard-current-price__image-container h-min max-md:pb-5">
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
              placeholder="Amount"
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
              placeholder="Email"
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

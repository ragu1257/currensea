
"use client";
import { notFound} from "next/navigation";
import { useSearchParams } from "next/navigation";
import {currencies} from "@/constants/index";

export default function SelectCurrency() {
  const searchParams = useSearchParams();
  const Amount = searchParams.get("Amount");
  const From = searchParams.get("From");
  const To = searchParams.get("To");
  
  if (!Amount || !From || !To || parseFloat(Amount) < 1 || !currencies.find(currency => currency.value === From) || !currencies.find(currency => currency.value === To)){
    notFound();
 }
  return (

      <h1 className="text-light-1 text-5xl text-center border-dashed border-2 mb-10">Dashboard</h1>

  );
}
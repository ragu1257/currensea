"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { currencies } from "@/constants/index"
import { useRouter } from "next/navigation";

export default function SelectCurrency() {
  const router = useRouter()
  const [currencyDataFrom , setCurrencyDataFrom] = useState(null)
  const [currencyDataTo , setCurrencyDataTo] = useState(null)
  const [amount , setAmout] = useState('')

  const currenciesDataFrom = 
  currencyDataTo ? currencies.filter(currency => currency.value !== currencyDataTo).map((currency) => {
    return (
      <SelectItem key={currency.value} value={currency.value}>
        {currency.label}
      </SelectItem>
    )
  }
  ) 
  :

  currencies.map((currency) => {
    return (
      <SelectItem key={currency.value} value={currency.value}>
        {currency.label}
      </SelectItem>
    )
  }
  )

  const currenciesDataTo = 
  currencyDataFrom ? currencies.filter(currency => currency.value !== currencyDataFrom).map((currency) => {
    return (
      <SelectItem key={currency.value} value={currency.value}>
        {currency.label}
      </SelectItem>
    )
  }
  ) 
  :

  currencies.map((currency) => {
    return (
      <SelectItem key={currency.value} value={currency.value}>
        {currency.label}
      </SelectItem>
    )
  }
  )

  const seletFromCurrency = (value) => {
    setCurrencyDataFrom(value)
  }

  const seletToCurrency = (value) => {
    setCurrencyDataTo(value)
  }

  const callApis = () => {

    const query = {
      Amount: amount,
      From: currencyDataFrom,
      To: currencyDataTo
    }
    const path = '/dashboard';
    const queryString = new URLSearchParams(query).toString();
    router.push(`${path}?${queryString}`);
  }

  return (
    <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Convert</CardTitle>
            <CardDescription>Enter the curreny amount and select curry</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="amount">Enter Amount</Label>
                  <Input type="number" id="amount" value={amount} onChange={(e)=>setAmout(e.target.value)} placeholder="Enter Amount" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">From</Label>
                  <Select onValueChange={seletFromCurrency}>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                    {currenciesDataFrom}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">To</Label>
                  <Select onValueChange={seletToCurrency}>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                    {currenciesDataTo}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col justify-center">
            <Button onClick={callApis}>Search</Button>
          </CardFooter>
        </Card>
  )
}
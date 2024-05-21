import SelectCurrency from "@/components/SelectCurrency";


export default async function Home() {
  // https://data.ecb.europa.eu/help/api/data
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p className="text-light-1 p-2">Currensea</p>  
        <SelectCurrency />
      </main>
    );
  }

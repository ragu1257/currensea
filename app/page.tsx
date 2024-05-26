import SelectCurrency from "@/components/SelectCurrency";


export default async function Home() {
  // https://data.ecb.europa.eu/help/api/data
    return (
      <main className="flex min-h-screen flex-col items-center pt-10">
      <p className="text-light-1 p-2 text-3xl">Currensea</p>  
        <SelectCurrency />
      </main>
    );
  }

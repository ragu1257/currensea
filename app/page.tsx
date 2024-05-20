import SelectCurrency from "@/components/SelectCurrency";


export default async function Home() {
  // https://data.ecb.europa.eu/help/api/data
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Currensea
        <SelectCurrency />
      </main>
    );
  }

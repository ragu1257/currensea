export default function Layout({
  children,
  allCurrencies,
  currentPrice,
  priceGraph }:
  Readonly<{
    children: React.ReactNode
    allCurrencies: React.ReactNode
    currentPrice: React.ReactNode
    priceGraph: React.ReactNode
  }>) {
  return (
    <div className="flex flex-col">
      {children}
      <div className="flex w-full justify-center">
        <div className="p-4 grow">
          {currentPrice}
        </div>
        <div className="p-4 grow">
          {priceGraph}
        </div>
      </div>
      <div className=" p-4 flex justify-center">  
          {allCurrencies}
        </div>


    </div>
  )
}
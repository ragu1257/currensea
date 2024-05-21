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
      <div className="flex w-full">
        <div className="p-4">
          {currentPrice}
        </div>
        <div className="p-4">
          {priceGraph}
        </div>
      </div>
      <div className="flex w-full p-4 justify-center">  
          {allCurrencies}
        </div>


    </div>
  )
}
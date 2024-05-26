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
      <div className="flex w-full justify-center max-lg:hidden">
        <div className="p-4 grow lg:col-span-full ">
          {currentPrice}
        </div>
        <div className="p-4 grow lg:col-span-full">
          {priceGraph}
        </div>
      </div>
      <div className=" w-full justify-center lg:hidden">
        <div className="text-light-1 p-4 grow lg:col-span-full ">
          {currentPrice} 
        </div>
        <div className="p-4 grow lg:col-span-full">
          {priceGraph}
        </div>
      </div>
      <div className=" p-4 flex justify-center">  
          {allCurrencies}
        </div>


    </div>
  )
}
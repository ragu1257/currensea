export default function Layout({ 
  children, 
  allCurrencies, 
  currentPrice, 
  priceGraph }: 
  { children: React.ReactNode 
    allCurrencies: React.ReactNode
    currentPrice: React.ReactNode
    priceGraph: React.ReactNode
  }) {
  return (
    <div>
      {children}
      <div>
        {allCurrencies}
        {currentPrice}
        {priceGraph}
      </div>
    </div>
  )
}
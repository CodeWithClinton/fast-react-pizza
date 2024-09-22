import Header from './Header'
import CartOverview from "../features/cart/CartOverview"

export default function AppLayout() {
  return (
    <div>
      <Header />
      <main>
        <h3>Content</h3>
      </main>
      <CartOverview />
    </div>
  )
}

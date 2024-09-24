import Header from './Header'
import CartOverview from "../features/cart/CartOverview"
import { Outlet, useNavigation } from 'react-router-dom'
import Loader from './Loader'

export default function AppLayout() {

  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  return (
    <div className='grid h-screen grid-rows-[auto_1fr_auto] bg-red-500'> 
      {isLoading && <Loader />}
      <Header />
      <main className='overflow-scroll'>
        <Outlet />
      </main>
      <CartOverview />
    </div>
  )
}

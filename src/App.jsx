import { useState } from 'react'
import { Routes , Route} from 'react-router-dom'
import CurrencyChart from './Pages/CurrencyChart'
import Navbar from './Components/Navbar'
import CurrencyBasket from './Pages/CurrencyBasket'
import Volatality from './Pages/Volatality'
import Prediction from './Pages/Prediction'
import CurrentRates from './Pages/CurrentRates'
import Index from './Pages/Index'

function App() {

  return (

    <div className='w-screen h-screen select-none flex'>
        <Navbar/>
        <Routes>
          <Route path='/' element ={<CurrentRates/>}/>
          <Route path='/CurrencyBasket' element ={<CurrencyBasket/>}/>
          <Route path='/Volatility' element ={<Volatality/>}/>
          <Route path='/Prediction' element ={<Prediction/>}/>
          <Route path='/CurrencyChart' element ={<CurrencyChart/>}/>
          <Route path='/Index' element ={<Index/>}/>

        </Routes>
    </div>
  )
}

export default App

import { NavLink } from "react-router-dom";

function Navbar(){
    return (
        <div className="h-full w-[14%] bg-[#1D1D41] flex flex-col gap-5 p-4 items-center">
            <div className="flex justify-center gap-1 h-[10%] items-center">
                <h1 className="text-white text-3xl font-bold cursor-pointer">Currency</h1>
            </div>
            <div className="flex flex-col justify-center gap-5 w-full">
                <NavLink to="/" className="text-white flex items-center gap-2 text-xl h-14 p-2 w-full rounded-lg hover:text-white">Description</NavLink>
                <NavLink to="/Index" className="text-white flex items-center gap-2 text-xl h-14 p-2 w-full rounded-lg hover:text-white">CurrentRates</NavLink>
                <NavLink to="/CurrencyChart" className="text-white flex items-center gap-2 text-xl h-14 p-2 w-full rounded-lg hover:text-white">CurrencyChart</NavLink>
                <NavLink to="/CurrencyBasket" className="text-white flex items-center gap-2 text-xl h-14 p-2 w-full rounded-lg hover:text-white">CurrencyBasket</NavLink>
                <NavLink to="/Volatility" className="text-white flex items-center gap-2 text-xl h-14 p-2 w-full rounded-lg hover:text-white">Volatality</NavLink>
                <NavLink to="/Prediction" className="text-white flex items-center gap-2 text-xl h-14 p-2 w-full rounded-lg hover:text-white">Prediction</NavLink>

            </div>
        </div>
    )
}

export default Navbar
import MainChart from "../Components/MainChart";
import CurrencyInputForm from "../Components/CurrencyInputForm";

 
 const CurrencyChart = ()=>{

    return(
        <div className="w-[86%] overflow-y-scroll">
            {/* <CurrencyInputForm/> */}
            <MainChart/>
        </div>
    )
 }

 export default CurrencyChart;
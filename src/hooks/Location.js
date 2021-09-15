import { Link, useLocation } from "react-router-dom";


const Location = () => {

    const location = useLocation()

    const locationArray = location.pathname.split("/")

    console.log(locationArray)

    return locationArray

}

export default Location

    
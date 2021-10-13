import { useLocation } from "react-router-dom";


const Location = () => {

    const location = useLocation()

    const locationArray = location.pathname.split("/")

    return locationArray

}

export default Location

    
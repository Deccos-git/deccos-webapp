import { MobileMenu } from '../StateManagment/MobileMenu';
import { useContext } from 'react';

const MenuStatus = () => {
    const [menu, setMenu] = useContext(MobileMenu)

    if(menu === "flex"){
        return "none"
    } else if (menu === "none"){
        return "flex"
    }
}

export default MenuStatus


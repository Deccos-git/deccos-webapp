import Iconbar from './topbar/Iconbar';
import '../CSS/topbar.css';
import {useFirestore, useFirestoreID} from "../firebase/useFirestore"
import Auth from '../firebase/Auth';

const BottomBar = () => {
    const docs  = useFirestore("CompagnyMeta")
    const auth = Auth()


    return (
        <header className="top-bar bottom-bar">
            <Iconbar auth={auth} />
        </header>
    )
}

export default BottomBar

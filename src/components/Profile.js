import { useFirestoreUser } from "../firebase/useFirestore"
import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./RightSideBar"
import { auth } from "../firebase/config.js"
import { useState, useEffect } from 'react';

const Profile = () => {

    const [user, setUser] = useState("")

    useEffect(() => {
        auth.onAuthStateChanged(User =>{
            setUser(User)
        })
    }, [])

    const docs = useFirestoreUser(user.uid)

    docs && docs.map(doc => {
        const username = doc.UserName 
        console.log(username)
    })
        

    return (
        <div className="main">
            <LeftSideBar />
                
            <RightSideBar />
        </div>
    )
}

export default Profile

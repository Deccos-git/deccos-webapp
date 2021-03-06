import LeftSideBar from "./LeftSideBar";
import LeftSideBarFullScreen from "./LeftSideBarFullScreen";
import RightSideBar from "./rightSideBar/RightSideBar"
import { useFirestoreUser, useFirestoreIntroductions, useFirestoreAboutMe, useFirestore } from "./../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import uuid from 'react-uuid';
import { client } from "../hooks/Client";
import { useHistory } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import { Auth } from '../StateManagment/Auth';
import Location from "../hooks/Location"
import MenuStatus from "../hooks/MenuStatus";
import worldIcon from '../images/icons/world-icon.png'
import heartIcon from '../images/icons/heart-icon.png'

const PublicProfile = () => {
    const [authO] = useContext(Auth)
    const [numberOfContributions, setNumberOfContributions] = useState('')
    const [admin, setAdmin] = useState(false)
    const [impacteer, setImpacteer] = useState(false)
    const [displayImpact, setDisplayImpact] = useState('')

    const history = useHistory()
    const route = Location()[3]
    const id = uuid()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const menuState = MenuStatus()

    const profiles = useFirestoreUser(route)
    const introductions = useFirestoreIntroductions("Introductions", route)
    const aboutMes = useFirestoreAboutMe(route)
    const admins = useFirestore('Admins')
    const impacteers = useFirestore('Impacteers')
    const compagny = useFirestore("CompagnyMeta")

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDisplayImpact(comp.Impact)
        })
    },[compagny])

    useEffect(() => {
        admins && admins.forEach(admin => {
            if(admin.UserID === authO.ID){
                setAdmin(true)
            }
        })
    }, [admins])

    useEffect(() => {
        impacteers && impacteers.forEach(impacteer => {
            if(impacteer.UserID === authO.ID){
                setImpacteer(true)
            }
        })
    }, [impacteers])

    let room = ""

    function createRoomName(){

        profiles && profiles.forEach(profile => {
            room = authO.ID < profile.ID ? authO.ID+'_'+profile.ID : profile.ID+'_'+authO.ID
        })
    } createRoomName()

    useEffect(() => {
        if(authO.ID != undefined){
            const contributions = () => {
                db.collection('Contributions')
                .where('Compagny', '==', client)
                .where('RecieverID', '==', authO.ID)
                .get()
                .then(querySnapshot => {
                    setNumberOfContributions(querySnapshot.docs.length)
                })
            }
            contributions()
        }
    }, [profiles])


    const findChat = async() => {

        let chats = ""

        await db.collection("Chats")
            .where("Compagny", "==", client)
            .where("Room", "==", room)
            .get()
            .then(querySnapshot => {

                chats = querySnapshot.docs.length

            })

        return chats
    }
    
    const startChat = async () => {

        if(await findChat() === 0){
            createChat()
            console.log("create chat")
        } else if (await findChat() === 1){
            console.log("link chat")
            linkToChat()
        }
    }

    const linkToChat = () => {
        db.collection("Chats")
            .where("Compagny", "==", client)
            .where("Room", "==", room)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    const id = doc.data().ID

                    history.push(`/${client}/ChatRoom/${id}`)

                })
            })
    }

    const createChat = () => {
        db.collection("Chats")
        .doc()
        .set({
            ID: id,
            Room: room,
            Members: [
                route,
                authO.ID
            ],
            MemberList: [
                route,
                authO.ID
            ],
            Timestamp: timestamp,
            Compagny: client,
            Messages: 0
        })
        .then(() => {
            history.push(`/${client}/ChatRoom/${id}`)
        })
    }

    const showContributions = (e) => {

        const id = e.target.dataset.id
        
        history.push(`/${client}/Contributions/${id}`)

    }

    const showLikes = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/Likes/${id}`)
    }

    const showImpact = () => {
        if(displayImpact === true && admin === true && impacteer === true){
            return 'flex'
        } else if (displayImpact === true && admin === true && impacteer === false){
            return 'flex'
        } else if (displayImpact === true && admin === false && impacteer === false){
            return 'none'
        } else if (displayImpact === false && admin === false && impacteer === false){
            return 'none'
        } else if (displayImpact === false && admin === true && impacteer === true){
            return 'none'
        } else if (displayImpact === false && admin === true && impacteer === false){
            return 'none'
        } else if (displayImpact === false && admin === false && impacteer === true){
            return 'none'
        }
    }

    return (
            <div className="main">
                 <LeftSideBar />
                <LeftSideBarFullScreen/>
                {profiles && profiles.map(profile => (
                    <div className="profile public-profile-container" key={profile.ID} style={{display: menuState}}>
                        <div>
                            <img className="public-profile-photo" src={profile.Photo} alt="" />  
                            <h1>{profile.UserName}</h1>
                            <div className='like-icon-container-profile'>
                                {/* <div className='like-icon-inner-container' style={{display: showImpact()}}>
                                    <img src={worldIcon} data-id={profile.ID} onClick={showContributions}/>
                                    <p className='notification-counter-small'>{numberOfContributions}</p>
                                </div> */}
                                <div className='like-icon-inner-container'>
                                    <img src={heartIcon} data-id={profile.ID} onClick={showLikes}/>
                                    <p className='notification-counter-small'>{profile.Likes ? profile.Likes : 0}</p>
                                </div>
                            </div>
                            <div className="button-container-public-profile">
                                <button onClick={startChat}>Chatten</button>
                            </div>
                        </div>
                    </div>
                ))}
                <RightSideBar />
            </div>
    )
}

export default PublicProfile
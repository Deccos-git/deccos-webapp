import { useFirestore } from "../firebase/useFirestore"
import WaitingIcon from '../images/icons/waiting-icon.png'

const NotApproved = () => {

    const compagnies = useFirestore("CompagnyMeta")

    let logo = ""
    let website = ""
    let communityName = ""

    compagnies && compagnies.map(doc => {
        logo = doc.Logo
        website = doc.Website
        communityName = doc.CommunityName
    })

    return (
        <div>
             <header className="top-bar">
                <a href={`${website}`}><img src={logo} className="top-bar-logo" alt="logo" /></a>
            </header>
            <div className="main">
                <div className="approval-message-container">
                    <img src={WaitingIcon} alt="" />
                    <h1>Welkom bij {communityName}</h1>
                    <h2>Je account wacht nog op goedkeuring van een beheerder</h2>
                    <p>Zodra je account is goedgekeurd ontvang je een mailtje en kun je direct inloggen.</p>
                    <a href={`${website}`}>Terug naar de website</a>
                </div>
            </div>
        </div>
    )
}

export default NotApproved

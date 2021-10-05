import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { useFirestoreNotApproved } from "../firebase/useFirestore";
import { db, timestamp } from "../firebase/config";
import { client } from "../hooks/Client";
import { useFirestore } from "../firebase/useFirestore";
import firebase from "firebase";
import MenuStatus from "../hooks/MenuStatus";

const Registrations = () => {

    const notApprovedUsers = useFirestoreNotApproved()

    const compagny = useFirestore("CompagnyMeta")

    const menuState = MenuStatus()

    let banner = ""
    let docid = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewMember
        docid = comp.docid
    })

    const approveAdmin = (e) => {
        const id = e.target.dataset.id
        const forname = e.target.dataset.forname
        const surname = e.target.dataset.surname 
        const photo = e.target.dataset.photo
        const userID = e.target.dataset.userid

        const memberMap = {
            UserName: `${forname} ${surname}`,
            Photo: photo,
            ID: id
        }

        db.collection("Users")
        .doc(id)
        .update({
            Approved: true
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: `Welkom ${forname}!`,
                Type: "NewMember",
                Compagny: client,
                ButtonText: "Bekijk profiel",
                Timestamp: timestamp,
                ID: id,
                Banner: banner,
                Description: 'is lid geworden van de community',
                Link: `/${client}/PublicProfile/${userID}`,
                User: `${forname} ${surname}`,
                UserID: userID,
                UserPhoto: photo,
            }) 
        })
        .then(() => {
            db.collection("CompagnyMeta")
            .doc(docid)
            .update({
                Members: firebase.firestore.FieldValue.arrayUnion(memberMap)
            }) 
        })

    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile" style={{display: menuState}}>
                <div className="card-header">
                    <h2>Aanmeldingen</h2>
                    <p>Beheer de aanmeldingen van je community</p>
                </div>
                <div className="divider">
                    <h3>Nieuwe aanmeldingen</h3>
                    {notApprovedUsers && notApprovedUsers.map(user => (
                         <div className="userrole-users-container" key={user.ID}>
                            <img src={user.Photo} alt="" />
                            <p>{user.UserName}</p>
                            <p 
                            className="userrole-users-approve-button" 
                            data-id={user.Docid}
                            data-userid={user.ID}
                            data-forname={user.ForName} 
                            data-surname={user.SurName}
                            data-photo={user.Photo}
                            onClick={approveAdmin}>
                            Goedkeuren
                            </p>
                        </div>
                    ))}
                </div>
                
            </div>
            <RightSideBar/>
        </div>
    )
}

export default Registrations

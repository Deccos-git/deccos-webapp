import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile"
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar";
import { useFirestoreID } from "../../firebase/useFirestore";
import Location from "../../hooks/Location"
import { db } from "../../firebase/config";
import deleteIcon from '../../images/icons/delete-icon.png'
import { useHistory } from "react-router-dom"
import { client } from "../../hooks/Client";
import { useState } from "react";
import { bucket } from "../../firebase/config";
import firebase from "firebase";
import MenuStatus from "../../hooks/MenuStatus";


const GoalSettingsDetail = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [banner, setBanner] = useState("")
    const [type, setType] = useState("")

    const route = Location()[3]
    const menuState = MenuStatus()

    const goals = useFirestoreID("Goals", route)
    const history = useHistory()

    const deleteGoal = (e) => {

        goals && goals.forEach(goal => {
            db.collection("Goals")
            .doc(goal.docid)
            .delete()
            .then(() => {
                history.push(`/${client}/GoalSettings`)
            })
        })
    }

    const titleHandler = (e) => {

        const title = e.target.value

        setTitle(title)

    }

    const saveTitle = (e) => {

        goals && goals.forEach(goal => {
            db.collection("Goals")
            .doc(goal.docid)
            .update({
                Title: title
            })
        })

        e.target.innerHTML = "Opgeslagen"
    }

    const bodyHandler = (e) => {

        const body = e.target.value

        setBody(body)

    }

    const saveBody = (e) => {

        goals && goals.forEach(goal => {
            db.collection("Goals")
            .doc(goal.docid)
            .update({
                Body: body
            })
        })

        e.target.innerHTML = "Opgeslagen"
    }

    const bannerHandler = (e) => {

        const photo = e.target.files[0]

        console.log(photo)

        const storageRef = bucket.ref("/ProfilePhotos/" + photo.name);
        const uploadTask = storageRef.put(photo)

        uploadTask.then(() => {
        
            uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
            }
            }, (err) => {
                alert(err)
            }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);

            setBanner(downloadURL)

                })
            })
        })
    }

    const saveBanner = (e) => {
        goals && goals.forEach(goal => {
            db.collection("Goals")
            .doc(goal.docid)
            .update({
                Banner: banner
            })
        })

        e.target.innerHTML = "Opgeslagen"
    }

    const typeHandler = (e) => {

        const type = e.target.options[e.target.selectedIndex].value

        setType(type)

    }

    const saveType = (e) => {
        goals && goals.forEach(goal => {
            db.collection("Goals")
            .doc(goal.docid)
            .update({
                Type: type
            })
        })

        e.target.innerHTML = "Opgeslagen"
    }

    return (
        <div className="main">
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-goal" style={{display: menuState}}>
                {goals && goals.map(goal => (
                <div key={goal.ID}>
                    <div className="divider card-header">
                        <h1>{goal.Title}</h1>
                        <p>Pas de instellingen van het doel aan</p>
                    </div>
                    <div className="divider">
                        <h2>Titel</h2>
                        <input className="input-classic" type="text" defaultValue={goal.Title} onChange={titleHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h2>Banner</h2>
                        <img className='group-settings-banner' src={goal.Banner} alt="" />
                        <input type="file"  onChange={bannerHandler}/>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveBanner}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h2>SDG</h2>
                        <select name="" id="">
                            <option defaultValue={goal.SDG}></option>
                        </select>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h2>Doelgroep</h2>
                        <input type="text" defaultValue={goal.TargetGroup} />
                        <div className="button-container">
                            <button className="button-simple" onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                    <div className='divider'>
                        <h2>Impact op doelgroep</h2>
                        <textarea name="" id="" cols="30" rows="10" defaultValue={goal.ImpactTargetgroup}></textarea>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                    <div className='divider'>
                        <h2>Impact op maatschappij</h2>
                        <textarea name="" id="" cols="30" rows="10" defaultValue={goal.ImpactSociety}></textarea>
                        <div className="button-container">
                            <button className="button-simple" onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                     <div className="divider">
                        <h3>Groep verwijderen</h3>
                        <img className="delete-channel" src={deleteIcon} data-id={goal.ID} onClick={deleteGoal} />
                    </div>
                 </div>
                ))}        
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalSettingsDetail

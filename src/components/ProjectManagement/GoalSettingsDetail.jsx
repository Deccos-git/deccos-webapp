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
import ButtonClicked from "../../hooks/ButtonClicked";


const GoalSettingsDetail = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [banner, setBanner] = useState("")
    const [impactTargetgroup, setImpactTargetgroup] = useState('')
    const [impactSociety, setImpactSociety] = useState('')
    const [targetgroup, setTargetgroup] = useState('')

    const route = Location()[3]
    const menuState = MenuStatus()

    const goals = useFirestoreID("Goals", route)
    const history = useHistory()

    const deleteGoal = (e) => {

        const docid = e.target.dataset.docid 

        db.collection("Goals")
        .doc(docid)
        .delete()
        .then(() => {
            history.push(`/${client}/GoalSettings`)
        })
    }

    const titleHandler = (e) => {

        const title = e.target.value

        setTitle(title)

    }

    const saveTitle = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const docid = e.target.dataset.docid 

        db.collection("Goals")
        .doc(docid)
        .update({
            Title: title
        })
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

        ButtonClicked(e, 'Opgeslagen')

        const docid = e.target.dataset.docid 

        db.collection("Goals")
        .doc(docid)
        .update({
            Banner: banner
        })
    }

    const impactTargetgroupHandler = (e) => {
        const input = e.target.value 

        setImpactTargetgroup(input)
    }

    const saveImpactTargetgroup = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const docid = e.target.dataset.docid 

        db.collection("Goals")
            .doc(docid)
            .update({
                ImpactTargetgroup: impactTargetgroup
            })

    }

    const impactSocietyHandler = (e) => {
        const input = e.target.value 

        setImpactSociety(input)
    }

    const saveImpactSociety = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const docid = e.target.dataset.docid 

        db.collection("Goals")
            .doc(docid)
            .update({
                ImpactSociety: impactSociety
            })

    }

    const targetgroupHandler = (e) => {
        const input = e.target.value 

        setTargetgroup(input)
    }

    const saveTargetgroup = (e) => {

        ButtonClicked(e, 'Opgeslagen')

        const docid = e.target.dataset.docid 

        console.log(docid)
        console.log(targetgroup)

        db.collection("Goals")
            .doc(docid)
            .update({
                Targetgroup: targetgroup
            })

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
                            <button className="button-simple"  data-docid={goal.docid} onClick={saveTitle}>Opslaan</button>
                        </div>
                    </div>
                    <div className="divider">
                        <h2>Banner</h2>
                        <img className='group-settings-banner' src={goal.Banner} alt="" />
                        <input type="file"  onChange={bannerHandler}/>
                        <div className="button-container">
                            <button className="button-simple" data-docid={goal.docid} onClick={saveBanner}>Opslaan</button>
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
                        <input type="text" defaultValue={goal.Targetgroup} onChange={targetgroupHandler}/>
                        <div className="button-container">
                            <button className="button-simple"  data-docid={goal.docid} onClick={saveTargetgroup}>Opslaan</button>
                        </div>
                    </div>
                    <div className='divider'>
                        <h2>Impact op doelgroep</h2>
                        <textarea name="" id="" cols="30" rows="10" defaultValue={goal.ImpactTargetgroup} onChange={impactTargetgroupHandler}></textarea>
                        <div className="button-container">
                            <button className="button-simple" data-docid={goal.docid} onClick={saveImpactTargetgroup}>Opslaan</button>
                        </div>
                    </div>
                    <div className='divider'>
                        <h2>Impact op maatschappij</h2>
                        <textarea name="" id="" cols="30" rows="10" defaultValue={goal.ImpactSociety} onChange={impactSocietyHandler}></textarea>
                        <div className="button-container">
                            <button className="button-simple" data-docid={goal.docid} onClick={saveImpactSociety}>Opslaan</button>
                        </div>
                    </div>
                     <div className="divider">
                        <h3>Doel verwijderen</h3>
                        <img className="delete-channel" src={deleteIcon} data-id={goal.ID} data-docid={goal.docid} onClick={deleteGoal} />
                    </div>
                 </div>
                ))}        
            </div>
            <RightSideBar />
        </div>
    )
}

export default GoalSettingsDetail

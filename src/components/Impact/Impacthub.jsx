import LeftSideBar from "../LeftSideBar";
import LeftSideBarFullScreen from "../LeftSideBarFullScreen";
import MenuStatus from "../../hooks/MenuStatus";
import { db } from "../../firebase/config.js"
import { useState, useEffect } from "react";
import {useFirestore} from "../../firebase/useFirestore"
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket } from '../../firebase/config';

const Impacthub = () => {

    const [ID, setID] = useState('') 
    const [banner, setBanner] = useState("")
    const [docid, setDocid] = useState('')
    const [name, setName] = useState('')

    const menuState = MenuStatus()

    const compagnies = useFirestore('CompagnyMeta')
    const followers = useFirestore("FollowsImpacthub")

    useEffect(() => {
      compagnies && compagnies.forEach(compagny => {
          const ID = compagny.ID 
          const docid = compagny.docid
          const banner = compagny.ImpactBanner
          const name = compagny.Compagny

          setID(ID)
          setDocid(docid)
          setBanner(banner)
          setName(name)
      })
    }, [compagnies]);
    
    const ToggleSwitch = ({}) => {
        return (
          <div>
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox"
                     name={name} id={name} data-docid={docid} onChange={toggle} />
              <label className="label" htmlFor={name}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

    const toggle = (e) => {

        const check = e.target.checked
        const docid = e.target.dataset.docid

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            Impacthub: check
        })

    }

    const bannerHandler = (e) => {
        setBanner(spinnerRipple)

        const photo = e.target.files[0]

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
            saveImpactBanner(downloadURL)

                })
            })
        })
    }

    const saveImpactBanner = (downloadURL) => {

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            ImpactBanner: downloadURL
        })


    }
    
    return (
       <div className="main">
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                <div className="card-header">
                    <h1>Impactclub</h1>
                    <p>Verander de instellingen voor de impactclub</p>
                </div>
                <div className='divider'>
                    <h2>Upload een banner</h2>
                    <img id='impact-banner' src={banner} alt="" />
                    <input className="input-classic" onChange={bannerHandler} type="file" />
                </div>
                <div className='divider'>
                    <h2>Deel impactdashboard op impactclub</h2>
                    <ToggleSwitch/>
                </div>
                <div className='divider'>
                    <h2>Volgers op Impactclub</h2>
                    <p>Totaal: {followers.length}</p>
                    <div>
                        {followers && followers.map(follower => (
                            <div className='list-container'>
                                <div className='list-inner-container'>
                                    <div className='title-container'>
                                        <p>NAAM</p>
                                    </div>
                                    
                                    <div>
                                        <p>{follower.User}</p>
                                    </div>
                                </div>
                                
                            </div>
                        ))}

                    </div>

                </div>
                <div>
                    <a href={`https://deccos.nl/Impacthub/OrganisationDetail/${ID}`}><button>Naar impactclub</button></a>
                   
                </div>
            </div>
        </div>
    )
}

export default Impacthub

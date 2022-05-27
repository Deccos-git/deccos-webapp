import LeftSideBar from "../LeftSideBar"
import LeftSideBarFullScreen from "../LeftSideBarFullScreen"
import MenuStatus from "../../hooks/MenuStatus";
import arrowLeft from '../../images/icons/arrow-left-icon.png'
import arrowRight from '../../images/icons/arrow-right-icon.png'
import capIcon from '../../images/icons/cap-icon.png'
import rocketIcon from '../../images/icons/rocket-icon.png'
import bulbIcon from '../../images/icons/bulb-icon.png'
import feetIcon from '../../images/icons/feet-icon.png'
import { useFirestore } from "../../firebase/useFirestore";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import uuid from 'react-uuid';
import {ReactComponent as QuestionIcon}  from '../../images/icons/question-icon.svg'
import { client } from '../../hooks/Client';
import { NavLink, Link } from "react-router-dom";
import spinnerRipple from '../../images/spinner-ripple.svg'
import firebase from 'firebase'
import { bucket, db } from '../../firebase/config';
import ImpactGuideMenu from "../../hooks/ImpactGuideMenu";

const Impactclub = () => {

    const [color, setColor] = useState('')
    const [ID, setID] = useState('') 
    const [banner, setBanner] = useState("")
    const [docid, setDocid] = useState('')
    const [name, setName] = useState('')

    const history = useHistory()
    const menuState = MenuStatus() 
    const id = uuid()
    
    const colors = useFirestore('Colors')
    const compagnies = useFirestore('CompagnyMeta')

    useEffect(() => {
        colors && colors.forEach(color => {
            const background = color.Background 

            setColor(background)
        })

    },[colors])

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
        <div className="main-container" style={{display: menuState}}>
            <div className="page-header">
                <h1>Impactclub</h1>
                <div className='wizard-sub-nav'>
                    <NavLink to={`/${client}/Projectmanagement`} >
                        <div className='step-container'>
                            <img src={arrowLeft} alt="" />
                            <p>Projectbeheer</p>
                        </div>
                    </NavLink>  
                    {ImpactGuideMenu(21)}
                    <NavLink to={`/${client}/Introduction`} >
                        <div className='step-container'>
                            <p>Deccos Impact Guide</p>
                            <img src={arrowRight} alt="" />
                        </div>
                    </NavLink>
                </div>
            </div>
            <div className='profile profile-auth-profile'>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={capIcon} alt="" />
                        <h3>Uitleg</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p><b>
                        De Deccos Impactclub is een online platform waar je impact automatisch en 
                        real-time gedeeld kan worden met stakeholders en andere geïnteresseerden.
                        </b></p>
                        <p>
                        Doordat er een real-time kopie van jullie impact dashboard wordt gedeeld zijn jullie volledig transparant over jullie impact doelen en voortgang.
                        </p>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={rocketIcon} alt="" />
                        <h3>Aan de slag</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p><b>1. Upload een banner voor je impactclub account</b></p>
                        <img id='impact-banner' src={banner} alt="" />
                        <input className="input-classic" onChange={bannerHandler} type="file" />
                        <p><b>2. Deccos Impactclub profiel</b></p>
                        <div className='button-container-margin-top'>
                            <a href={`https://deccos.nl/OrganisationDetail/${client}/${ID}`} target='_blank'><button>Bekijk je profiel</button></a>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={bulbIcon} alt="" />
                        <h3>Tips</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <ol>
                            <li>
                                Kom je er niet uit of heb je behoefte aan ondersteuning van een impactexpert? 
                                Klik op het 
                                <NavLink to={`/${client}/Support`} >
                                    <QuestionIcon style={{width: '19px', height: '19px'}}/> 
                                </NavLink>
                                icon in de 
                                bovenbalk (onderbalk op mobiel) voor alle ondersteuningsmogelijkheden.
                            </li>
                            <li>Benieuwd naar de impact van andere sociale MKB'ers? Neem eens een kijkje in de <a href="https://deccos.nl/Milestones">Deccos Impactclub</a>.</li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div className='activity-meta-title-container'>
                        <img src={feetIcon} alt="" />
                        <h3>Volgende stap</h3>
                    </div> 
                    <div className='text-section' style={{backgroundColor: color}}>
                        <p>Dit was de laatste stap van de Deccos Impact Guide. Klik op de knop hieronder om terug te gaan naar het begin van de guide.</p>
                        <NavLink to={`/${client}/Introduction`} ><button>Terug naar begin</button></NavLink>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default Impactclub
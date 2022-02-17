import RightSideBar from "./rightSideBar/RightSideBar"
import LeftSideBarAuthProfile from "./LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "./LeftSideBarAuthProfileFullScreen";
import { db, bucket } from "../firebase/config.js"
import {useFirestore, useFirestoreID } from "../firebase/useFirestore"
import firebase from 'firebase'
import { useState, useEffect, useContext } from "react";
import MenuStatus from "../hooks/MenuStatus";
import { Colors } from "../StateManagment/Colors";
import "../CSS/toggleSwitch.css";

const Settings = () => {
    const [colors] = useContext(Colors)
    const [docid, setDocid] = useState('')
    const [welcome, setWelcome] = useState('')
    const [impact, setImpact] = useState('')
    const [projectManagement, setProjectManagement] = useState('')
    const [channels, setChannels] = useState('')
    const [groups, setGroups] = useState('')
    const [matches, setMatches] = useState('')

    const compagny = useFirestore("CompagnyMeta")

    console.log(colors)

    const [communityName, setCommunityName] = useState("")
    const [website, setWebsite] = useState("")
    const [backgroundColor, setBackgroundColor] = useState(colors.Background)
    const [topbarColor, setTopbarColor] = useState(colors.Topbar)
    const [topbarIconsColor, setTopbarIconsColor] = useState(colors.TopbarIcons)

    const menuState = MenuStatus()

    useEffect(() => {
        compagny && compagny.forEach(comp => {
            setDocid(comp.docid)
            setWelcome(comp.Welcome)
            setImpact(comp.Impact)
            setChannels(comp.Channels)
            setGroups(comp.Groups)
            setMatches(comp.Matches)
            setProjectManagement(comp.ProjectManagement)
        })
    },[compagny])

    const LogoHandler = (e) => {

        const logo = e.target.files[0]

        const storageRef = bucket.ref("/ProfilePhotos/" + logo.name);
        const uploadTask = storageRef.put(logo)

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

            saveLogo(downloadURL)

                })
            })
        })
    }

    const saveLogo = (banner) => {
        compagny && compagny.forEach(comp => {
            db.collection("CompagnyMeta")
            .doc(comp.docid)
            .update({
                Logo: banner
            })
        })
    }

    const communityNameHandler = (e) => {

        const communityName = e.target.value

        setCommunityName(communityName)

    }

    const saveName = (e) => {

        const docid = e.target.dataset.id
        db.collection("CompagnyMeta")
        .doc(docid)
        .update({
            CommunityName: communityName
        })
    }

    const websiteHandler = (e) => {

        const website = e.target.value

        setWebsite(website)

    }

    const saveWebsite = (e) => {

        const docid = e.target.dataset.id
        
        db.collection("CompagnyMeta")
        .doc(docid)
        .update({
            Website: website
        })
    }

    const backgroundColorHandler = (e) => {
        const color = e.target.value 

        console.log(color)

        setBackgroundColor(color)
    }

    const saveBackgroundColor = (e) => {
  
        e.target.innerText = 'Opgeslagen'

        db.collection('Colors')
        .doc(colors.docid)
        .update({
            Background: backgroundColor
        })
    }

    const topbarColorHandler = (e) => {
        const color = e.target.value 

        setTopbarColor(color)
    }

    const saveTopbarColor = (e) => {

        e.target.innerText = 'Opgeslagen'

        db.collection('Colors')
        .doc(colors.docid)
        .update({
            Topbar: topbarColor
        })
    }

    const topbarIconsColorHandler = (e) => {
        const color = e.target.value 

        console.log(color)

        setTopbarIconsColor(color)
    }

    const saveTopbarIconsColor = (e) => {

        e.target.innerText = 'Opgeslagen'

        db.collection('Colors')
        .doc(colors.docid)
        .update({
            TopbarIcons: topbarIconsColor
        })
    }

    // Toggle status from database

    const welcomeStatus = () => {
        if(welcome === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const projectManagementStatus = () => {
        if(projectManagement === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const impactStatus = () => {
        if(impact === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const channelsStatus = () => {
        if(channels === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const groupsStatus = () => {
        if(groups === true){
            return 'checked'
        } else {
            return ''
        }
    }

    const matchesStatus = () => {
        if(matches === true){
            return 'checked'
        } else {
            return ''
        }
    }

    // Toogle switch

    const ToggleSwitchWelcome = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={welcomeStatus()}
                     name={'welcome'} id={'welcome'} onChange={toggleWelcome} />
              <label className="label" htmlFor={'welcome'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchProjectManagement = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={projectManagementStatus()}
                     name={'projectManagement'} id={'projectManagement'} onChange={toggleProjectManagement} />
              <label className="label" htmlFor={'projectManagement'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchImpact = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={impactStatus()}
                     name={'impact'} id={'impact'} onChange={toggleImpact} />
              <label className="label" htmlFor={'impact'}>
                <span className="inner"/>
                <span className="switch"/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchChannels = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={channelsStatus()}
                     name={'channels'} id={'channels'} onChange={toggleChannels} />
              <label className="label" htmlFor={'channels'}>
                <span className="inner" data-selection='Uit'/>
                <span className="switch" data-selection='aan'/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchGroups = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={groupsStatus()}
                     name={'groups'} id={'groups'} onChange={toggleGroups} />
              <label className="label" htmlFor={'groups'}>
                <span className="inner" data-selection='Uit'/>
                <span className="switch" data-selection='aan'/>
              </label>
            </div>
          </div>
        );
      };

      const ToggleSwitchMatches = () => {
        return (
          <div className="container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" defaultChecked={matchesStatus()}
                     name={'matches'} id={'matches'} onChange={toggleMatches} />
              <label className="label" htmlFor={'matches'}>
                <span className="inner" data-selection='Uit'/>
                <span className="switch" data-selection='aan'/>
              </label>
            </div>
          </div>
        );
      };

      // Save setting to database

    const toggleWelcome = (e) => {
        const setting = e.target.checked

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            Welcome: setting
        })
    }

    const toggleProjectManagement = (e) => {
        const setting = e.target.checked

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            ProjectManagement: setting
        })
    }

    const toggleImpact = (e) => {
        const setting = e.target.checked

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            Impact: setting
        })
    }

    const toggleChannels = (e) => {
        const setting = e.target.checked

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            Channels: setting
        })
    }

    const toggleGroups = (e) => {
        const setting = e.target.checked

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            Groups: setting
        })
    }

    const toggleMatches = (e) => {
        const setting = e.target.checked

        db.collection('CompagnyMeta')
        .doc(docid)
        .update({
            Matches: setting
        })
    }

    console.log(topbarIconsColor)

    return (
        <div className="main" style={{backgroundColor:backgroundColor}}>
            <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <div className="profile profile-auth-profile" style={{display: menuState}}>
                {compagny && compagny.map(comp => (
                <div className="settings-inner-container" key={comp.ID}>
                    <div className="card-header">
                        <h1>Algemeen</h1>
                        <p>Verander de algemene instellingen van {comp.CommunityName}</p>
                    </div>
                    <div className="divider">
                        <h2>Community naam aanpassen</h2>
                        <input className="input-classic" type="text" defaultValue={comp.CommunityName} onChange={communityNameHandler} />
                        <div className="button-container button-container-top">
                            <button className="button-simple" data-id={comp.docid} onClick={saveName}>Opslaan</button>
                        </div>
                    </div >
                    <div className="divider logo-container">
                        <h2>Logo aanpassen</h2>
                        <img src={comp.Logo} alt="" />
                        <input className="input-classic" type="file" onChange={LogoHandler} />
                    </div >
                    <div className="divider">
                        <h2>Website aanpassen</h2>
                        <input className="input-classic" type="text" defaultValue={comp.Website} onChange={websiteHandler} />
                        <div className="button-container button-container-top">
                            <button className="button-simple" data-id={comp.docid} onClick={saveWebsite}>Opslaan</button>
                        </div>
                    </div >
                    <div className="divider">
                        <h2>Kleuren aanpassen</h2>
                        <div className='client-styles-container'>
                            <div className='color-container'>
                                <h5>Achtergrond</h5>
                                <input className="input-color" type="color" defaultValue={backgroundColor} onChange={backgroundColorHandler} />
                                <div className="button-container-colors">
                                    <button className="button-simple" onClick={saveBackgroundColor}>Opslaan</button>
                                </div>
                            </div>
                            <div className='color-container'>
                                <h5>Topbar</h5>
                                <input className="input-color" type="color" defaultValue={topbarColor} onChange={topbarColorHandler} />
                                <div className="button-container-colors">
                                    <button className="button-simple" onClick={saveTopbarColor}>Opslaan</button>
                                </div>
                            </div>
                            <div className='color-container'>
                                <h5>Topbar icons</h5>
                                <input className="input-color" type="color" defaultValue={topbarIconsColor} onChange={topbarIconsColorHandler} />
                                <div className="button-container-colors">
                                    <button className="button-simple" onClick={saveTopbarIconsColor}>Opslaan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='divider'>
                        <h2>Functionaliteiten</h2>
                        <div className='functionality-container'>
                            <p>Welkom</p>
                            <ToggleSwitchWelcome/>
                        </div>
                        <div className='functionality-container'>
                            <p>Kanalen</p>
                            <ToggleSwitchChannels/>
                        </div>
                        <div className='functionality-container'>
                            <p>Groepen</p>
                            <ToggleSwitchGroups/>
                        </div>
                        <div className='functionality-container'>
                            <p>Projectbeheer</p>
                            <ToggleSwitchProjectManagement/>
                        </div>
                        <div className='functionality-container'>
                            <p>Matchen</p>
                            <ToggleSwitchMatches/>
                        </div>
                        <div className='functionality-container'>
                            <p>Impact</p>
                            <ToggleSwitchImpact/>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            <RightSideBar />
        </div>
    )
}

export default Settings

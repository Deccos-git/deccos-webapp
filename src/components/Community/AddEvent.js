import LeftSideBarAuthProfile from "../LeftSideBarAuthProfile";
import LeftSideBarAuthProfileFullScreen from "../LeftSideBarAuthProfileFullScreen";
import RightSideBar from "../rightSideBar/RightSideBar"
import { motion } from "framer-motion"
import { db, timestamp } from "../../firebase/config.js"
import { client } from '../../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import { useFirestore, useFirestoreChannelName, useFirestoreID} from '../../firebase/useFirestore.js';
import { useRef, useContext, useState, useEffect } from 'react';
import firebase from 'firebase'
import { bucket } from '../../firebase/config';
import spinnerRipple from '../../images/spinner-ripple.svg'
import { Auth } from '../../StateManagment/Auth';
import MenuStatus from "../../hooks/MenuStatus";
import TinyMCE from './TinyMCE'
import ScrollToTop from "../../hooks/ScrollToTop";

const AddEvent = () => {
    const [authO] = useContext(Auth)
    const [memberIDArray, setMemberIDArray] = useState('')
    const [selectedEmailUser, setSelectedEmailUser] = useState('')
    const [userName, setuserName] = useState('')
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [bannerPhoto, setBannerPhoto] = useState("")
    const [loader, setLoader] = useState("")
    const [capacity, setCapacity] = useState("")
    const [price, setPrice] = useState("")
    const [date, setDate] = useState("")
    const [locationType, setLocationType] = useState("")
    const [locationName, setLocationName] = useState("")
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")
    const [physicalLocationDisplay, setPhysicalLocationDisplay] = useState("none")
    const [headerPhoto, setHeaderPhoto] = useState('')
    const [channelID, setChannelID] = useState('')

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const channels = useFirestoreChannelName('Events')
    const banners = useFirestore('Banners')

    const menuState = MenuStatus()
    ScrollToTop()

    // Set channel ID to state

    useEffect(() => {
        channels && channels.forEach(channel => {
            if(channel.Name === 'Events'){
                setChannelID(channel.ID)
            }
        })

    }, [channels])

    useEffect(() => {
        banners && banners.forEach(banner => {
            const header = banner.NewEvent
            setHeaderPhoto(header)
        })
    }, [banners])

    useEffect(() => {
        memberIDArray && memberIDArray.forEach(ID => {
            db.collection('Users')
            .where('ID', '==', ID)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc)
                })
            })
        })
        
    }, [channels])

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    let communityName = ""
    let logo = ""

    compagny && compagny.forEach(comp => {
        communityName = comp.CommunityName
        logo = comp.Logo
    })
    
    useEffect(() => {

        const memberID = []

        channels && channels.forEach(channel => {
            channel.Members.forEach(member => {
                memberID.push(member)
            })
        })

        setMemberIDArray(memberID)
    },[channels])

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const locationTypeSelect = (e) => {

        const type = e.target.value

        setLocationType(type)

        if(type === "online"){
            setPhysicalLocationDisplay("none")
        } else if (type === "physical-location"){
            setPhysicalLocationDisplay("block")
        }

    }

    const locationNameHandler = (e) => {
        const locationName = e.target.value
        setLocationName(locationName)
    }

    const locationStreetHandler = (e) => {
        const street = e.target.value
        setStreet(street)
    }

    const cityHandler = (e) => {
        const city = e.target.value
        setCity(city)
    }

    const dateHandler = (e) => {
        const date = e.target.value
        setDate(date)
    }

    const priceHandler = (e) => {
        const price = e.target.value
        setPrice(price)
    }

    const capacityHandler = (e) => {
        const capacity = e.target.value
        setCapacity(capacity)
    }

    const photoHandler = (e) => {
        setLoader(spinnerRipple)

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

            setBannerPhoto(downloadURL)
            setLoader(downloadURL)

                })
            })
        })
    }
    
    const saveEvent = (e) => {

        db.collection("Events")
        .doc()
        .set({
            Title: title,
            Body: body,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: authO.UserName,
            UserPhoto: authO.Photo,
            UserID: authO.ID,
            Price: price,
            Capacity: capacity,
            Date: date,
            Banner: bannerPhoto,
            Location: locationType,
            LocationName: locationName,
            LocationAdres: street,
            LocationCity: city,
            Type: 'Events',
            ChannelID: channelID
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewEvent",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuw event toegevoegd:",
                ButtonText: "Bekijk event",
                User: authO.UserName,
                UserPhoto: authO.Photo,
                UserID: authO.ID,
                Banner: headerPhoto,
                Link: `EventDetail/${id}`
            }) 
        })
        .then(() => {
            db.collection("Search")
            .doc()
            .set({
                Name: title,
                Compagny: client,
                Type: 'Event',
                Link: `EventDetail/${id}`
            })
        })
        .then(() => {
            db.collection("Email").doc().set({
                to: selectedEmailUser,
                cc: "info@Deccos.nl",
                message: {
                subject: `${authO.UserName} heeft een nieuw event geplaatst in het kanaal Events.`,
                html: `Hallo , </br></br>
    
                    ${authO.UserName} heeft een nieuw event geplaatst in het kanaal Events.</br></br>

                    Titel:${title}</br></br>
    
                    Bekijk het event <a href="https://www.deccos.co/${client}/EventDetail/${id}"><u>hier</u></a>.<br><br>
                    
                    Vriendelijke groet, </br></br>
                    ${communityName} </br></br>
                    <img src="${logo}" width="100px">`,
                Gebruikersnaam: `${userName}`,
                Emailadres: selectedEmailUser,
                Type: "Group"
                  }     
              });
        })
    }

    return (
        <div className="main">
             <LeftSideBarAuthProfile />
            <LeftSideBarAuthProfileFullScreen/>
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{display: menuState}}>
                <div className="card-header">
                        <h1>Voeg een event toe</h1>
                        <p>Voeg een nieuw event waar de leden van de community zich voor aan kunnen melden</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h2>Geef het event een titel</h2>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <TinyMCE setBody={setBody}/>
                    <div className="divider">
                        <h2>Voeg een bannerfoto toe</h2>
                        <input onChange={photoHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                    <div className="divider">
                        <h2>Is het event online of heeft een fysieke locatie?</h2>
                        <select name="" id="" onChange={locationTypeSelect}>
                            <option value="">--- Selecteer ---</option>
                            <option value="online">Online</option>
                            <option value="physical-location">Fysieke locatie</option>
                        </select>
                        <div style={{display: physicalLocationDisplay}}>
                            <h5>Naam locatie</h5>
                            <input type="text" placeholder="Schrijf hier de naam van de locatie" onChange={locationNameHandler} />
                            <h5>Locatie straat en huisnummer</h5>
                            <input type="text" placeholder="Schrijf hier de straat en het huisnummer van de locatie" onChange={locationStreetHandler} />
                            <h5>Locatie stad of dorp</h5>
                            <input type="text" placeholder="Schrijf hier in welke stad of dorp het evenement plaats vindt" onChange={cityHandler} />
                        </div>
                    </div>
                    <div className="divider">
                        <h2>Wanneer vindt het event plaats?</h2>
                        <input type="date" onChange={dateHandler} />
                    </div>
                    <div className="divider">
                        <h2>Hoeveel kost het event?</h2>
                        <input type="number" onChange={priceHandler} />
                    </div>
                    <div className="divider">
                        <h2>Wat is het maximaal aantal deelnemers?</h2>
                        <input type="number" onChange={capacityHandler}/>
                    </div>
                </form>
                <div className="button-container" id="button-add-event">
                    <Link to={`/${client}/Events`}><button onClick={saveEvent}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddEvent

import LeftSideBar from "./LeftSideBar"
import LeftSideBarFullScreen from "./LeftSideBarFullScreen"
import RightSideBar from "./rightSideBar/RightSideBar"
import { motion } from "framer-motion"
import { db, timestamp } from "../firebase/config.js"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import { useFirestore } from '../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useContext, useState } from 'react';
import firebase from 'firebase'
import { bucket } from '../firebase/config';
import spinnerRipple from '../images/spinner-ripple.svg'
import { Auth } from '../StateManagment/Auth';
import MenuStatus from "../hooks/MenuStatus";

const AddEvent = () => {
    const [authO] = useContext(Auth)
    const [memberIDArray, setMemberIDArray] = useState('')

    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const channels = useFirestoreChannelName('Events')
    const editorRef = useRef(null);
    const menuState = MenuStatus()

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

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    
    useEffect(() => {

        const memberID = []

        channels && channels.forEach(channel => {
            channel.Members.forEach(member => {
                memberID.push(member)
            })
        })

        setMemberIDArray(memberID)
    },[channels])

    console.log(memberIDArray)

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
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


    let banner = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewEvent
    })

    const photoHandler = (e) => {
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
            LocationCity: city
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
                Banner: banner,
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
            <LeftSideBar />
            <LeftSideBarFullScreen/>
            <motion.div className="article"
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{display: menuState}}>
                <div className="card-header">
                        <h2>Voeg een event toe</h2>
                        <p>Voeg een nieuw event waar de leden van de community zich voor aan kunnen melden</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het event een titel</h4>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <div className="divider">
                        <h4>Geef het event een omschrijving</h4>
                        <Editor onChange={bodyHandler}
                        apiKey="dz1gl9k5tz59z7k2rlwj9603jg6xi0bdbce371hyw3k0auqm"
                        onInit={(evt, editor) => editorRef.current = editor}
                        init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family: Raleway, sans-serif; font-size:14px; color: gray }'
                        }}
                        />
                    </div>
                    <div className="divider">
                        <h4>Voeg een bannerfoto toe</h4>
                        <input onChange={photoHandler} type="file" />
                        <div className="spinner-container">
                            <img src={loader} alt="" />
                        </div> 
                    </div>
                    <div className="divider">
                        <h4>Is het event online of heeft een fysieke locatie?</h4>
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
                        <h4>Wanneer vindt het event plaats?</h4>
                        <input type="date" onChange={dateHandler} />
                    </div>
                    <div className="divider">
                        <h4>Hoeveel kost het event?</h4>
                        <input type="number" onChange={priceHandler} />
                    </div>
                    <div className="divider">
                        <h4>Wat is het maximaal aantal deelnemers?</h4>
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

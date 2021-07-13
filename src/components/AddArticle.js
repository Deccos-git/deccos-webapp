import LeftSideBar from "./LeftSideBar"
import RightSideBar from "./rightSideBar/RightSideBar"
import { useState } from 'react'
import { motion } from "framer-motion"
import { db, timestamp } from "../firebase/config.js"
import { client } from '../hooks/Client';
import { Link } from "react-router-dom";
import uuid from 'react-uuid';
import Auth from '../firebase/Auth.js';
import { useFirestore } from '../firebase/useFirestore.js';
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

const AddArticle = () => {

    const auth = Auth()
    const id = uuid()
    const compagny = useFirestore("CompagnyMeta")
    const editorRef = useRef(null);

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    console.log(title, body)

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }

    const titleHandler = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const bodyHandler = (e) => {
        if (editorRef.current) {
            setBody(editorRef.current.getContent());
            }
    }

    let banner = ""

    compagny && compagny.forEach(comp => {
        banner = comp.ActivityBanner.NewArticle
    })
    

    const saveArticle = () => {
        db.collection("KnowlegdeCentre")
        .doc()
        .set({
            Title: title,
            Body: body,
            Compagny: client,
            Timestamp: timestamp,
            ID: id,
            User: auth.UserName,
            UserPhoto: auth.Photo
        })
        .then(() => {
            db.collection("AllActivity")
            .doc()
            .set({
                Title: title,
                Type: "NewArticle",
                Compagny: client,
                Timestamp: timestamp,
                ID: id,
                Description: "heeft een nieuw artikel toegevoegd:",
                ButtonText: "Bekijk artikel",
                User: auth.UserName,
                UserPhoto: auth.Photo,
                Banner: banner,
                Link: `/${client}/ArticleDetail`
            }) 
        })
    }

    return (
        <div className="main">
            <LeftSideBar />
            <motion.div className="card"
            initial="hidden"
            animate="visible"
            variants={variants}>
                <div className="card-header">
                        <h2>Voeg een artikel toe</h2>
                        <p>Voeg een nieuw artikel voor de leden van de community</p>
                </div>
                <form id="add-goal-form">
                    <div className="divider">
                        <h4>Geef het artikel een titel</h4>
                        <input type="text" placeholder="Schrijf hier de titel" onChange={titleHandler} />
                    </div >
                    <div className="divider">
                        <h4>Schrijf je artikel</h4>
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
                    <div>
                        <h4>Voeg een bestaande categorie toe</h4>
                        <select name="" id="">
                            <option value="">Categorie 1</option>
                        </select>
                        <p>Of voeg een nieuwe categorie toe</p>
                        <input type="text" placeholder="Schrijf hier je catgeorie" />
                    </div>
                </form>
                <div id="button-add-goal">
                    <Link to={`/${client}/KnowledgeCentre`}><button onClick={saveArticle}>Opslaan</button></Link>
                </div>
            </motion.div>
            <RightSideBar />
        </div>
    )
}

export default AddArticle

import { useFirestoreTimestamp } from '../../firebase/useFirestore'
import { useHistory } from "react-router-dom";
import { client } from "../../hooks/Client"
import ReactionBar from './ReactionBar'
import { useFirestoreMessages } from '../../firebase/useFirestore';
import { db } from '../../firebase/config';
import { useState, useEffect } from 'react';
import ScrollToTop from "../../hooks/ScrollToTop";

const IntroductionsCard = () => {

    const introductions = useFirestoreTimestamp("Introductions")

    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let id = null

    introductions && introductions.forEach(introduction => {
        id = introduction.ID
    })

    const messages  = useFirestoreMessages("Messages", id)

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const showReactions = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MessageDetail/${id}`)
    }

    const ReactionCardButton = ({id}) => {

        const [reactions, setReactions] = useState([])

        const number = async () => {

            const numberArray = []

            await db.collection('Messages')
            .where('ParentID', '==', id)
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    numberArray.push(doc.data().ID)
                })
            })

            return numberArray
        }

        useEffect(() => {
            number().then(reaction => {
                setReactions(reaction)
            })
        }, [messages])

        console.log(reactions)

        return(
            <button onClick={showReactions} data-id={id} className="introduction-reaction-button">Bekijk {reactions.length} reacties</button>
        )
    }

    return (
        introductions && introductions.map(introduction => (
            <div className="introduction-card" key={introduction.ID} >
                <img className="user-image" src={introduction.Photo} alt="" data-id={introduction.AuthID} onClick={profileLink} />
                <h2 className="user-image" data-id={introduction.AuthID} onClick={profileLink}>{introduction.UserName}</h2>
                <p>{introduction.Body}</p>
                <ReactionBar message={introduction}/>
                <ReactionCardButton id={introduction.ID}/>
                <p className="introductioncard-timestamp">{introduction.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
            </div>
        ))
    )
}

export default IntroductionsCard

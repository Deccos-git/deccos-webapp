import { useFirestoreTimestamp } from '../firebase/useFirestore'
import { useHistory } from "react-router-dom";
import { client } from "../hooks/Client"
import ReactionBar from './ReactionBar'
import { useFirestoreMessages } from '../firebase/useFirestore';

const IntroductionsCard = () => {

    const docs = useFirestoreTimestamp("Introductions")

    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let id = null

    docs && docs.forEach(doc => {
        id = doc.ID
    })

    const messages  = useFirestoreMessages("Messages", id)

    const messageLength = messages.length

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    const showReactions = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/MessageDetail/${id}`)
    }

    return (
        docs && docs.map(doc => (
            <div className="introduction-card" key={doc.ID} >
                <img className="user-image" src={doc.Photo} alt="" data-id={doc.AuthID} onClick={profileLink} />
                <h2 className="user-image" data-id={doc.AuthID} onClick={profileLink}>{doc.UserName}</h2>
                <p>{doc.Body}</p>
                <ReactionBar message={doc}/>
                <button onClick={showReactions} data-id={doc.ID} className="introduction-reaction-button">Bekijk {messageLength} reacties</button>
                <p className="introductioncard-timestamp">{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
            </div>
        ))
    )
}

export default IntroductionsCard

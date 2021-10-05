import { useFirestoreTimestamp } from '../firebase/useFirestore'
import { useHistory } from "react-router-dom";
import { client } from "../hooks/Client"

const IntroductionsCard = () => {

    const docs = useFirestoreTimestamp("Introductions")

    const history = useHistory()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const profileLink = (e) => {
        const id = e.target.dataset.id

        history.push(`/${client}/PublicProfile/${id}`)
    }

    return (
        docs && docs.map(doc => (
            <div className="introduction-card" key={doc.ID} >
                <img className="user-image" src={doc.Photo} alt="" data-id={doc.AuthID} onClick={profileLink} />
                <h2 className="user-image" data-id={doc.AuthID} onClick={profileLink}>{doc.UserName}</h2>
                <p>{doc.Body}</p>
                <input id="input-introduction-card" type="text" placeholder="Schrijf hier je reactie" />
                <p className="introductioncard-timestamp">{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
            </div>
        ))
    )
}

export default IntroductionsCard

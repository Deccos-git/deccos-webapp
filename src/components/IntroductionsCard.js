import { useFirestoreTimestamp } from '../firebase/useFirestore'

const IntroductionsCard = () => {

    const docs = useFirestoreTimestamp("Introductions")

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        docs && docs.map(doc => (
            <div className="list introductions-list" key={doc.ID} >
                <img src={doc.Photo} alt="" />
                <h2>{doc.UserName}</h2>
                <p>{doc.Body}</p>
                <input id="input-introduction-card" type="text" placeholder="Schrijf hier je reactie" />
                <p className="introductioncard-timestamp">{doc.Timestamp.toDate().toLocaleDateString("nl-NL", options)}</p>
            </div>
        ))
    )
}

export default IntroductionsCard

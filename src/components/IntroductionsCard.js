import { useFirestoreTimestamp } from '../firebase/useFirestore'

const IntroductionsCard = () => {

    const docs = useFirestoreTimestamp("Introductions")

    console.log(docs)

    return (
        docs && docs.map(doc => (
            <div className="list introductions-list" key={doc.ID} >
                <img src={doc.Photo} alt="" />
                <h2>{doc.UserName}</h2>
                <p>{doc.Body}</p>
                <input id="input-introduction-card" type="text" placeholder="Schrijf hier je reactie" />
            </div>
        ))
    )
}

export default IntroductionsCard

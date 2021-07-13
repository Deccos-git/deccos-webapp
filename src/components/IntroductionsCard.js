import { useFirestoreTimestamp } from '../firebase/useFirestore'

const IntroductionsCard = () => {

    const docs = useFirestoreTimestamp("Introductions")

    console.log(docs)

    return (
        docs && docs.map(doc => (
            <div className="card introductions-card" >
                <img src={doc.Photo} alt="" />
                <h2>{doc.UserName}</h2>
                <p>{doc.Body}</p>
            </div>
        ))
    )
}

export default IntroductionsCard

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
                <input type="text" placeholder="Schrijf hier je reactie" />
                <div className="button-container">
                    <button>Bekijk introductie</button>
                </div>
            </div>
        ))
    )
}

export default IntroductionsCard

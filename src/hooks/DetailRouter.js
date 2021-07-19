import { client } from '../hooks/Client';
import { useHistory } from "react-router-dom";
import { db } from '../firebase/config';
import { useFirestore } from '../firebase/useFirestore';

const DetailRouter = (docID, URL) => {

    const history = useHistory();
    const routes = useFirestore("Route")

    console.log(docID)

    routes && routes.forEach(route => {
        db.collection("Route")
        .doc(route.docid)
        .update({
            Route: docID
        })
    })

    history.push(`/${client}/${URL}`)
}

export default DetailRouter
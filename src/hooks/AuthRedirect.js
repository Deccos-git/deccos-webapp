import { useHistory } from "react-router-dom";
import { client } from '../hooks/Client';
import { useFirestore } from "../firebase/useFirestore";
import Auth from "../firebase/Auth";

const AuthRedirect = () => {
    const history = useHistory();

    const docs = useFirestore("CompagnyMeta")
    const auth = Auth()

    const memberIDArray = []

    docs && docs.forEach(doc => {
      const members = doc.Members
      
      members && members.forEach(member => {
        memberIDArray.push(member.ID)
      })
    })

      const authID = auth && auth.ID

      console.log(authID)

      if(authID === undefined || !memberIDArray.includes(authID)){
        history.push(`/${client}/Login`)
      } else {
        history.push(`/${client}/AllActivity`) 
      }
}

export default AuthRedirect
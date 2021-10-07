import { db } from "./config.js"
import { useState, useEffect} from 'react';
import { client } from '../hooks/Client';

const useFirestore = (collection) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection])  

    return docs
};

const useFirestoreID = (collection, id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("ID", "==", id)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id])  

    return docs
};

const useFirestoreTimestamp = (collection) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .orderBy("Timestamp", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection])  

    return docs
};

const useFirestoreUser = (userID, state) => {

    const [docs, setDocs] = useState("")
    
    const docArray = []
    useEffect(() => {
        db.collection("Users")
        .where("Compagny", "==", client)
        .where("ID", "==", userID)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        setDocs(docArray)

    }, [userID, state])  

    return docs
};

const useFirestoreUsers = (state) => {

    const [docs, setDocs] = useState("")
    
    const docArray = []
    useEffect(() => {
        db.collection("Users")
        .where("Compagny", "==", client)
        .where("Deleted", "==", state)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        setDocs(docArray)

    }, [state])  

    return docs
};

const useFirestoreMessages = (collection, id  ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("ParentID", "==", id)
        .orderBy("Timestamp", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id])  

    return docs
};

const useFirestoreNewMessages = (collection, id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("UserID", "==", id)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id])  

    return docs
};

const useFirestoreMyMessages = (collection, id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("UserID", "==", id)
        .where("Public", "==", true)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id])  

    return docs
};

const useFirestoreChats = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("Chats")
        .where("Compagny", "==", client)
        .where("Room", "==", id)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [])  

    return docs
};

const useFirestoreChatsGroups = (collection, auth ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("MemberList", "array-contains", auth)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, auth])  

    return docs
};


const useFirestoreNotifications = (collection, id  ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .orderBy("Timestamp", "desc")
        .where("Compagny", "==", client)
        .where("RecieverID", "==", id)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id])  

    return docs
};

const useFirestoreNewNotifications = (collection, auth, status) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("RecieverID", "==", auth)
        .where("Read", "==", status)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, status])  

    return docs
};

const useFirestoreChannelItems = (collection, id  ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("ChannelID", "==", id)
        .orderBy("Timestamp", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id])  

    return docs
};

const useFirestoreContributions = (collection, type, id ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where(type, "==", id)
        .orderBy("Timestamp", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id, type])  

    return docs
};

const useFirestoreIntroductions = (collection, id ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where("Compagny", "==", client)
        .where("AuthID", "==", id)
        .orderBy("Timestamp", "asc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [collection, id ])  

    return docs
};

const useFirestoreNotApproved = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("Users")
        .where("Compagny", "==", client)
        .where("Approved", "==", false)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [])  

    return docs
};

const useFirestoreProfileFields = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("ProfileFields")
        .where("Compagny", "==", client)
        .where("Template", "==", true)
        .orderBy("Position", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [])  

    return docs
};

const useFirestoreProfileFieldsUser = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("ProfileFields")
        .where("Compagny", "==", client)
        .where("Template", "==", false)
        .orderBy("Position", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [])  

    return docs
};

const useFirestoreContributionGraph = (month, goal) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("ContributionGraph")
        .where("Month", "==", month)
        .where("GoalID", "==", goal)
        .orderBy("LastActive", "desc")
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [month, goal])  

    return docs
};

const useFirestoreAboutMe = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("AboutMe")
        .where("UserID", "==", id)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [id])  

    return docs
};


export { 
    useFirestore, 
    useFirestoreID, 
    useFirestoreTimestamp, 
    useFirestoreUser, 
    useFirestoreUsers, 
    useFirestoreMessages,
    useFirestoreNewMessages,
    useFirestoreChats,
    useFirestoreChatsGroups,
    useFirestoreNotifications,
    useFirestoreChannelItems,
    useFirestoreContributions,
    useFirestoreNewNotifications,
    useFirestoreIntroductions,
    useFirestoreMyMessages,
    useFirestoreNotApproved,
    useFirestoreProfileFields,
    useFirestoreProfileFieldsUser,
    useFirestoreContributionGraph,
    useFirestoreAboutMe
}
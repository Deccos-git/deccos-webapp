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

const useFirestoreUser = (userID) => {

    const [docs, setDocs] = useState("")
    
    const docArray = []
    useEffect(() => {
        db.collection("Users")
        .where("Compagny", "array-contains", client)
        .where("ID", "==", userID)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        setDocs(docArray)

    }, [userID])  

    return docs
};

const useFirestoreUsers = (state) => {

    const [docs, setDocs] = useState("")
    
    const docArray = []
    useEffect(() => {
        db.collection("Users")
        .where("Compagny", "array-contains", client)
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

const useFirestoreUsersApproved = (state) => {

    const [docs, setDocs] = useState("")
    
    const docArray = []
    useEffect(() => {
        db.collection("Users")
        .where("Compagny", "array-contains", client)
        .where("Deleted", "==", state)
        .where('Approved', '==', true)
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

const useFirestoreNewMessagesChatGroups = ( id ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Messages')
        .where("Compagny", "==", client)
        .where("Channel", "==", 'Chat')
        .where("Members", "array-contains", id)
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

const useFirestoreGroupsAuth = ( auth ) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Subscriptions')
        .where("Compagny", "==", client)
        .where('Type', '==', 'Group')
        .where("UserID", "==", auth)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [auth])  

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
        .where("Compagny", "array-contains", client)
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

const useFirestoreContributionGraph = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("ContributionGraph")
        .where('Compagny', '==', client)
        .orderBy("LastActive", "desc")
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

const useFirestoreContributionGraphUser = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("ContributionGraphUser")
        .where('Compagny', '==', client)
        .where("UserID", "==", id)
        .orderBy("LastActive", "desc")
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

const useFirestoreMessageGraph = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("MessageGraph")
        .where('Compagny', '==', client)
        .orderBy("LastActive", "desc")
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

const useFirestoreLikesGraphUser = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("LikeGraph")
        .where('Compagny', '==', client)
        .where("UserID", "==", id)
        .orderBy("LastActive", "desc")
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

const useFirestoreLikesGraph = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("LikeGraph")
        .where('Compagny', '==', client)
        .orderBy("LastActive", "desc")
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

const useFirestoreMemberGraph = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("MemberGraph")
        .where('Compagny', '==', client)
        .orderBy("LastActive", "asc")
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

const useFirestoreAboutMe = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("AboutMe")
        .where('Compagny', '==', client)
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

const useFirestoreActivities = (goal) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("Activities")
        .where("GoalID", "==", goal)
        .where('Compagny', '==', client)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [goal])  

    return docs
};

const useFirestoreChannelName = (name) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection("Channels")
        .where("Name", "==", name)
        .where('Compagny', '==', client)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [name])  

    return docs
};

const useFirestoreAdmins = (collection) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where('Compagny', '==', client)
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

const useFirestoreSubscriptions = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Subscriptions')
        .where('Compagny', '==', client)
        .where('UserID', '==', id)
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

const useFirestoreSubscriptionsChannelGroup = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Subscriptions')
        .where('Compagny', '==', client)
        .where('SubID', '==', id)
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

const useFirestoreSubscriptionsNotApproved = (collection) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection(collection)
        .where('Compagny', '==', client)
        .where('Approved', '==', false)
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

const useFirestoreTasks = (activity) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Tasks')
        .where('Compagny', '==', client)
        .where('ActivityID', '==', activity)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [activity])  

    return docs
};

const useFirestoreTasksComplete = (activity) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Tasks')
        .where('Compagny', '==', client)
        .where('ActivityID', '==', activity)
        .where('Completed', '==', true)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [activity])  

    return docs
};

const useFirestoreMyTasks = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Tasks')
        .where('Compagny', '==', client)
        .where('AppointedID', '==', id)
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

const useFirestoreMyEvents = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('EventSignups')
        .where('Compagny', '==', client)
        .where('UserID', '==', id)
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

const useFirestoreQuestionnaireFields = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('QuestionnaireFields')
        .where('Compagny', '==', client)
        .where('QuestionnaireID', '==', id)
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

const useFirestoreMatches = (id) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('Matches')
        .where('Compagny', '==', client)
        .where('Match', 'array-contains', id)
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

const useFirestoreMatchRoadmaps = () => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('MatchRoadmaps')
        .where('Compagny', '==', client)
        .orderBy("Position", "asc")
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

const useFirestoreMatchTagsType = (type) => {

    const [docs, setDocs] = useState("")

    useEffect(() => {
        const unsub = db.collection('MatchTags')
        .where('Compagny', '==', client)
        .where('Type', '==', type)
        .onSnapshot(querySnapshot => {
            let docArray = []
            querySnapshot.forEach(doc => {
                docArray.push({...doc.data(), docid: doc.id})
            })
            setDocs(docArray)
        })
        
        return () => unsub();

    }, [type])  

    return docs
};


export { 
    useFirestore, 
    useFirestoreID, 
    useFirestoreTimestamp, 
    useFirestoreUser, 
    useFirestoreUsers, 
    useFirestoreUsersApproved,
    useFirestoreMessages,
    useFirestoreChats,
    useFirestoreChatsGroups,
    useFirestoreGroupsAuth,
    useFirestoreNotifications,
    useFirestoreChannelItems,
    useFirestoreContributions,
    useFirestoreNewNotifications,
    useFirestoreIntroductions,
    useFirestoreMyMessages,
    useFirestoreNewMessagesChatGroups,
    useFirestoreNotApproved,
    useFirestoreProfileFields,
    useFirestoreProfileFieldsUser,
    useFirestoreContributionGraph,
    useFirestoreContributionGraphUser,
    useFirestoreMessageGraph,
    useFirestoreLikesGraph,
    useFirestoreLikesGraphUser,
    useFirestoreMemberGraph,
    useFirestoreAboutMe,
    useFirestoreActivities,
    useFirestoreChannelName,
    useFirestoreAdmins,
    useFirestoreSubscriptions,
    useFirestoreSubscriptionsChannelGroup,
    useFirestoreSubscriptionsNotApproved,
    useFirestoreTasks,
    useFirestoreTasksComplete,
    useFirestoreMyTasks,
    useFirestoreMyEvents,
    useFirestoreQuestionnaireFields,
    useFirestoreMatches,
    useFirestoreMatchRoadmaps,
    useFirestoreMatchTagsType
}
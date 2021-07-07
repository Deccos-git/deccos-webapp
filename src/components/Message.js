import LikeBar from "./LikeBar"

const Message = ({doc}) => {

    console.log(doc)

    

    return (
        <div className="message-card" >

            <p>{doc.Message}</p>
            <input type="text" placeholder="Schrijf hier je reactie" />
            < LikeBar />
        </div>
    )
}

export default Message

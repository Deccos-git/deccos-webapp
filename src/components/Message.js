import LikeBar from "./LikeBar"

const Message = ({doc}) => {

    console.log(doc)

    

    return (
        <div className="message-card" >
            <div className="auth-message-container">
                <p className="auth-message">{doc.User}</p>
                <p>heeft geschreven:</p>
            </div>
            <p>{doc.Message}</p>
            <input type="text" placeholder="Schrijf hier je reactie" />
            < LikeBar />
        </div>
    )
}

export default Message

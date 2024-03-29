import { useAblyReactChannelEffect } from "./useAblyReactChannelEffect";
import React from "react";
import styles from "./AblyChatComponent.module.css"
const AblyChatComponent = () => {
    
    let inputBox = null;
    let messageEnd = null;

    const [messageText, setMessageText] = React.useState("")
    const [receivedMessages, setReceivedMesssages] = React.useState([])
    const messageTextIsEmpty = messageText.trim().length === 0;

    const [channel, ably] = useAblyReactChannelEffect("chat-demo", (message) => {

        const history = receivedMessages.slice(-199);
        setReceivedMesssages([...history, message])

    })

    const sendChatMessage = (messageText) => {
        channel.publish({ name: "chat-message", data: messageText })
        setMessageText("")
        inputBox.focus()
    }

    const handleFormSubmission = (event) => {
        event.preventDefault();
        sendChatMessage(messageText);
    }

    const handleKeyPress = (event) => {
        if(event.charCode !== 13 || messageTextIsEmpty) {
            return
        }
        sendChatMessage(messageText)
        event.preventDefault();
    }

    const messages = receivedMessages.map((message, index) => {
        const author = message.connectionId === ably.connection.id ? "me" : "other"
        return <span key={index} className={styles.message} data-author={author}>{message.data}</span>
    })

    React.useEffect(() => {
        messageEnd.scrollIntoView({ behaviour: "smooth" })
    })

    return (
        <div className={styles.chatHolder}>
            <div className={styles.chatText}>
                {messages}
                {/* empty element to control scroll */}
                <div ref={(element) => { messageEnd = element }}></div> 
            </div>
            <form onSubmit={handleFormSubmission} className={styles.form}>
                <textarea
                    ref={(element) => { inputBox = element }}
                    value={messageText}
                    placeholder="Type your gossip here..."
                    onChange={event => setMessageText(event.target.value)}
                    onKeyDown={handleKeyPress}
                    className={styles.textarea}
                ></textarea>
                <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>Send</button>
                <br />
            </form>
        </div>
    )
}

export default AblyChatComponent


const GetLink = (message) => {

        const exRegex = /(img)|(embed)|(video)/gm
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        const links = message.Message.match(urlRegex)
        const exemptions = message.Message.match(exRegex)

        if(exemptions != null){
            return message.Message
        } else if(links != null){
    
            const newText = message.Message.replace(links[0], `<a href="${links}", target="_blank">${links}</a>`)
    
            return newText
    
        } else {
    
            return message.Message
        }
    
}

export default GetLink


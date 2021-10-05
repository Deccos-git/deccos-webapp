

const getLink = (message) => {

        const text = message.innerText
    
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        const links = text.match(urlRegex)
    
        if(links != null){
    
        const newText = text.replace(links[0], `<a href="${links}", target="_blank">${links}</a>`)
    
        messageP.innerHTML = newText
    
        };
    
}


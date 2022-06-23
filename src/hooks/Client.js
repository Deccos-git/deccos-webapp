const url = window.location.pathname.split("/")
const client = url[1]
const type = url[2]
const pathID = url[3]
const pathIDTwo = url[4]

export {client, type, pathID, pathIDTwo}


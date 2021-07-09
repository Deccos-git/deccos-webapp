const url = window.location.pathname.split("/")
const client = url[1]
const type = url[2]
const pathID = url[3]

export {client, type, pathID}

const url = window.location.pathname.split("/")
const client0 = url[1]
const type = url[2]
const pathID = url[3]

const client = client0
        .replace('%20', '-')
        .replace('%20', '-')
        .replace('%20', '-')
        .replace('%20', '-')
        .replace('%20', '-')
        .replace('%c3%a9', 'e')
        .replace('%c3%a9', 'e')
        .replace('%C3%B6', 'o')
        .replace('%C3%B6', 'o')
        .trim()
        .toLocaleLowerCase()

console.log(client)

export {client, type, pathID}


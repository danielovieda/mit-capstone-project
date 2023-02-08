const baseUrl = 'http://localhost:1337'
export async function apiPostNoAuth(url, body) {
    return await fetch(`${baseUrl}${url}`, {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
    })
}

export async function apiPost(url, body) {
    return await fetch(`${baseUrl}${url}`, {
        method: 'post',
        headers: new Headers({
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
    })
}

export async function apiDelete(url, body) {
    return await fetch(`${baseUrl}${url}`, {
        method: 'delete',
        headers: new Headers({
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
    })
}

function getToken() {
    return localStorage.getItem('auth');
}
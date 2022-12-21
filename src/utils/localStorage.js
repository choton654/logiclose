export const storeData = (key, data) => {
    localStorage.setItem(key, data)
}

export const getData = (key) => {
    return localStorage.getItem(key)
}

export const clearData = () => {
    localStorage.clear()
    // localStorage.removeItem('token')
    // localStorage.removeItem('stepCompleted')
}
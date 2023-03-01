import CryptoJS from 'crypto-js'

export default function hash(data: string) {
    return CryptoJS.SHA256(data).toString()
}
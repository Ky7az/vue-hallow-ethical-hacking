const TOKEN_KEY = 'user-token'

const TokenService = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    }
}

const AxiosConfig = {
    headers: {
        'Authorization': "Token " + TokenService.getToken()
    }
};

let PROTO;
if (import.meta.env.MODE == 'production') {
    PROTO = 'https'
} else {
    PROTO = 'http'
}

export const API_HOST = '127.0.0.1'
export { PROTO }
export { TokenService }
export { AxiosConfig }

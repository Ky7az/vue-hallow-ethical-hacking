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
}

export const API_HOST = '127.0.0.1:8000'

export {TokenService}
export {AxiosConfig}
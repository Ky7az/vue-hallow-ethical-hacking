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

export {TokenService}
export {AxiosConfig}
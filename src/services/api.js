const BASE_URL = "https://project-api-1sks.onrender.com/api/v1"
export const userEndpoints = {
    REGISTER_USER: BASE_URL + "/user/register",
    LOGIN_USER: BASE_URL + "/user/login",
    LOGOUT_USER: BASE_URL + "/user/logout",
    UPDATE_REFRESH_TOKEN: BASE_URL + "/user/refresh-Token",
    CHANGE_PASSWORD: BASE_URL + "/user/change-password",
    CURRENT_USER: BASE_URL + "/user/current-user",
}

export const projectEndpoints = {
    CREATE_PROJECT: BASE_URL + "/project/create",
    GET_PROJECT: BASE_URL + "/project/get",
    UPDATE_PROJECT: BASE_URL + "/project/update",
    DELETE_PROJECT: BASE_URL + "/project/delete",
}

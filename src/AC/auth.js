import { LOGIN, LOGOUT, START, SUCCESS, FAIL } from '../constants'
import { Authorisation } from "../utils/authorisation"
import {makeRequest, Endpoints} from  "../utils/api"

export function addComment(comment, articleId) {
    return {
        type: ADD_COMMENT,
        payload: {...comment, articleId},
        withRandomId: true
    }
}

export function getAuthToken(userLogin,userPassword) {
    return (dispatch, state) => {
        dispatch({
            type: LOGIN + START
        })

        makeRequest(Endpoints.GET_AUTH_TOKEN(), {
          login: userLogin,
          password: userPassword
          })
          .then(response=> {
              //debugger;
              if (response.data && response.data.token) {
                // console.log("Authorisation SUCCESS");
                Authorisation.setToken(response.data.token);
                dispatch({ type: LOGIN + SUCCESS, response })
              }
          })
          .catch(error=> {
              // console.log("Authorisation FAIL");
              dispatch({ type: LOGIN + FAIL, error })
          })
    }
}


// static removeToken() {
//     makeRequest(Endpoints.REMOVE_AUTH_TOKEN())
//         .then(() => {
//             localStorage.removeItem("token");
//             location.href = "/"
//         })
//         .catch(() => {
//             localStorage.removeItem("token");
//             location.href = "/"
//         });
// }

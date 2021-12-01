import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { ScoreUpdateAction, User, UserAddAction } from './reducers/userReducer';

// Generator function that calls another function to asynchronously fetch users from the server and on complete of fetch, dispatches action to load the fetched users on Redux store 
function* getUser(){
    try{
        const users: User[] = yield call(fetchUser);
        yield all([
            put({type: "SET_CURRENT_USER", payload: users.find((one) => one.id==="1")}),
            put({type: "LOAD_USER", payload: users})
        ])
    }catch(e){
        console.log(e);
    }
} 

// Generator function  that calls another function to async. add user to server and dispatch action to load/add the new user on Redux store 
function* addUser(action: UserAddAction){
    try{
        const user: User = yield call(_addUser, action.payload);
        yield put({type: "LOAD_USER", payload: [user]})
    }catch(e){

    }
}

// Generator function that calls another function to async. update users' score and status on server's db and dispatch action to update the user status on Redux store as well 
function* updateScore(action: ScoreUpdateAction){
    try{
        let user: User = yield call(_updateScore, action.payload);
        // console.log(user);
        yield put({type: "UPDATE_CURRENT_SCORE", payload: user})
    }catch(e){

    }
}

//=============================================================================================

// Actual function that uses axios to async. fetch users list from the server
const fetchUser = async() => {
    const resp =  await axios.get("https://my-json-server.typicode.com/koiralamandip/matchingJSON/user?_sort=score[high]&_order=asc", {headers: {'Content-Type': 'application/json'}});
    // console.log(resp.data)
    return resp.data
}

// Function to async. add/insert user to the server
const _addUser = async(payload: User) => {
    const response = await axios.post("https://my-json-server.typicode.com/koiralamandip/matchingJSON/user", payload,{headers: {'Content-Type': 'application/json'}});
    return response.data
}

// Function to async. update the user status on server's db
const _updateScore = async(payload: {last: number, user: User}) => {
    // If last score is better than high score, set high score to the last score, or leave the high score as it is
    // But if highscore is < 8 (initial state = 0, remember?), i.e. if the player hasn't played the game once,..
    // ...always change highscore to reflect last score 
    let high = payload.user.score.high;
    payload.user.score.last = payload.last;
    if (payload.user.gameplay === 0){
        payload.user.score.high = payload.last;
    }else if (high > payload.last){
        payload.user.score.high = payload.last;
    }
    // On every update of user status, we know the player played the game one more time
    payload.user.gameplay = payload.user.gameplay + 1;
    
    const response = await axios.put(`https://my-json-server.typicode.com/koiralamandip/matchingJSON/user/${payload.user.id}`, payload.user, {headers: {'Content-Type': 'application/json'}});
    return response.data
}

//================================================================================================
// Watcher generator functions that watch for actions of types mentioned as below,
// .. and care for only the last dispatch of such actions
//.. and call appropriate functions to carry on with the logic for such actions 

function* getUserSaga(){
    yield takeLatest("FETCH_USER", getUser);
}

function* addUserSaga(){
    yield takeLatest("ADD_USER", addUser);
}

function* updateScoreSaga(){
    yield takeLatest("UPDATE_SCORE_DB", updateScore);
}

// Similar to combining reducers, this is a combination of all watcher functions of Saga, because we need to set up watchers on store (store.js)
// it is easy to wrap all watchers into a single function, for ease in setting up saga
export default function* rootSaga(){
    yield all([
        getUserSaga(),
        addUserSaga(),
        updateScoreSaga(),
    ])
}


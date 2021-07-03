import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { ScoreUpdateAction, User, UserAddAction } from './reducers/userReducer';


function* getUser(){
    try{
        const user: User[] = yield call(fetchUser);
        yield all([
            put({type: "SET_CURRENT_USER", payload: user[0]}),
            put({type: "LOAD_USER", payload: user})
        ])
        

    }catch(e){

    }
} 

function* addUser(action: UserAddAction){
    try{
        const user: User = yield call(_addUser, action.payload);
        yield put({type: "LOAD_USER", payload: [user]})
    }catch(e){

    }
}

function* updateScore(action: ScoreUpdateAction){
    try{
        yield call(_updateScore, action.payload);
        // console.log(user);
        yield put({type: "UPDATE_CURRENT_SCORE", payload: action.payload.last})
    }catch(e){

    }
}

const fetchUser = async() => {
    const resp =  await axios.get("http://localhost:3002/user", {headers: {'Content-Type': 'application/json'}});
    // console.log(resp.data)
    return resp.data
}

const _addUser = async(payload: User) => {
    const response = await axios.post("http://localhost:3002/user", payload,{headers: {'Content-Type': 'application/json'}});
    return response.data
}

const _updateScore = async(payload: {last: number, user: User}) => {
    let high = payload.user.score.high;
    payload.user.score.last = payload.last;
    if (high < 8){
        payload.user.score.high = payload.last;
    }else if (high > payload.last){
        payload.user.score.high = payload.last;
    }
    const response = await axios.put(`http://localhost:3002/user/${payload.user.id}`, payload.user, {headers: {'Content-Type': 'application/json'}});
    return response.data
}


function* getUserSaga(){
    yield takeLatest("FETCH_USER", getUser);
}

function* addUserSaga(){
    yield takeLatest("ADD_USER", addUser);
}

function* updateScoreSaga(){
    yield takeLatest("UPDATE_SCORE_DB", updateScore);
}

export default function* rootSaga(){
    yield all([
        getUserSaga(),
        addUserSaga(),
        updateScoreSaga(),
    ])
}


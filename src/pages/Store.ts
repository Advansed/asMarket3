import { combineReducers  } from 'redux'
import axios from 'axios'
import { Reducer } from 'react';

var reducers: Array<Reducer<any, any>>;reducers = []

export const i_state = {

    auth:                        false,
    route:                          "",
    login:                          {
          code: "", SMS: "", name: "", address: ""
        , paymentmethod: "", password: "", email: "", image: ""},
    categories:                                     [],
    goods:                                          [],
    basket:                                         [],
    order:                                          "",
    market:                                         {
        name:     "АсМаркет",
        address:    "ул. Полины Осипенко, 8/1, Якутск, Респ. Саха (Якутия), 677001",
        sum:                                       250,
    },
    search:                                         "",
    orders:                                         [],
    category:                                       "",
    sub:                                            "",
    gcard:                                          "",
    actions:                                        [],
    action:                                         "",

}


for(const [key, value] of Object.entries(i_state)){
    reducers.push(
        function (state = i_state[key], action) {
            switch(action.type){
                case key: {
                    if(typeof(value) === "object"){
                        if(Array.isArray(value)) {
                            return action[key]
                        } else {
                            let data: object; data = {};
                            for(const key1 of Object.keys(value)){ 
                                data[key1] = action[key1] === undefined ? state[key1] : action[key1]
                            }   
                            return data
                        }

                    } else return action[key]
                }
                default: return state;
            }       
        }

    )
}


export async function   getData(method : string, params){

    let res = await axios.post(
            URL + method, params
    ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}

export async function   getData1C(method : string, params){

    let res = await axios.post(
            URL1C + method, params
    ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}


function                create_Store(reducer, initialState) {
    var currentReducer = reducer;
    var currentState = initialState;
    var listeners: Array<any>; listeners = []
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            listeners.forEach((elem)=>{
                if(elem.type === action.type){
                    elem.func();
                }
            })
            return action;
        },
        subscribe(listen: any) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === listen.num; 
            });
            if(ind >= 0){
                listeners[ind] = listen;
            }else{
                listeners = [...listeners, listen]
            }
        }
    };
}

const                   rootReducer = combineReducers({

    auth:                   reducers[0],
    route:                  reducers[1],
    login:                  reducers[2],
    categories:             reducers[3],
    goods:                  gdReducer, //reducers[4],
    basket:                 reducers[5],  
    order:                  reducers[6],  
    market:                 reducers[7],
    search:                 reducers[8],
    orders:                 reducers[9],  
    category:               reducers[10],  
    sub:                    reducers[11],  
    gcard:                  reducers[12],
    actions:                reducers[13],
    action:                 reducers[14],
})


function                gdReducer(state:any = i_state.goods, action){
    switch(action.type) {
        case "goods": {    
            return [...state, ...action.goods]
        }
        default: return state
    }
}

export const Store   =  create_Store(rootReducer, i_state)

export const URL1C = "https://marketac.ru/ut/hs/API/V1/"

export const URL = "http://marketac.ru:3000/"

export async function   getDatas(){
}

async function load( categ, page = 1 ){
    let res = await getData("method", {
        method: "Р_Продукты",
        CategoryId: categ,
        page: page,
    })  
    if(res.length > 0){
        Store.dispatch({ type: "goods", goods: res })
  //      if( categ === Store.getState().category.Код )
        load( categ, page + 1 )
    } 

}

export function Phone(phone): string {
    if(phone === undefined) return ""
    let str = "+"
    for(let i = 0;i < phone.length;i++){
      let ch = phone.charCodeAt(i)
      if( ch >= 48 && ch <= 57) str = str + phone.charAt(i)
    }
    return str
}

export async function getProfile(phone){
    Store.dispatch({type: "auth", auth: true });
    let res = await getData("method", {
            method: "Профиль",
            phone:  Phone(phone),
        })
    let login = res[0];login.type = "login"
    Store.dispatch( login )
    console.log(res[0])
}

async function exec(){
    let res: any

    res = await getData("method", {method: "Акции"})
    console.log(res)
    Store.dispatch({type: "actions", actions: res.map((e) => {
        e.Товары = JSON.parse(e.Товары)
        return e
    })})  

    let phone = localStorage.getItem("marketAs.login")
  //if(phone !== undefined) getProfile(phone)

    console.log("exec")
    res = await getData("method", {method: "Категории"})
    console.log(res)
    Store.dispatch({type: "categories", categories: res.map((e) => {
        e.Категории = JSON.parse(e.Категории)
        return e
    })})

    load( "", 1)

}

exec();

export const car_jarr = [
    {Имя: "Сертификат в подарок",       Описание: "Подарите сертификат близким",    Картинка: "", Цвет: '#9c0c3c'}
  , {Имя: "ПромоКод",                   Описание: "Скидка на первый заказ 15%",     Картинка: "", Цвет: '#03bd38'}
  , {Имя: "Акционные товары, скидки",   Описание: "",                               Картинка: "", Цвет: '#ff0000'}
  , {Имя: "Бесплатная доставка",        Описание: "Купите товары больше 2000 руб",  Картинка: "", Цвет: '#00dd00'}
]

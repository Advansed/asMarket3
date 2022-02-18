import { combineReducers  } from 'redux'
import axios from 'axios'
import { Reducer } from 'react';
import localForage from "localforage";

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
    order:                                          {
            type:                   "order",
            StatusId:               "",
            Order_No:               "",
            Phone:                  "",
            Address:                "",
            entrance:               0, 
            CustomerName :          "",
            DeliveryMethod:         "Доставка",
            DeliveryTime:           "",
            PaymentMethodId:        "Эквайринг",
            CustomerComment:        "",
            PaymentStatus:          0,
            Total:                  0,
            DelivSum:               0,
            lat:                    "",
            lng:                    "",       
            Change:                 "",   
            promokod:               "",
            promo_percent:          0,
            promo_sum:              0, 
            OrderDetails:           [],

    },
    market:                                         {
        name:               "АсМаркет",
        address:            "ул. Полины Осипенко, 8/1, Якутск, Респ. Саха (Якутия), 677001",
        sum:                                       250,
        tabs:                                       [
            {sum: 0,        del: 150},
            {sum: 1000,     del: 100},
            {sum: 1500,     del: 50},
            {sum: 2000,     del: 0},
        ] 
    },
    search:                                         "",
    orders:                                         [],
    category:                                       "",
    sub:                                            "",
    gcard:                                          "",
    actions:                                        [],
    action:                                         "",
    param:                                          "",
    load:                                           false,    
    progress:                                        0,    
    logs:                                           [],    
    error:                                          "",
    lstore:                                         true,

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
        },
        unSubscribe(index) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === index; 
            });
            if(ind >= 0){
                listeners.splice(ind, 1)
            }        
        }
    };
}

const                   rootReducer = combineReducers({

    auth:                    reducers[0],
    route:                   reducers[1],
    login:                   reducers[2],
    categories:              reducers[3],
    goods:                     gdReducer, //reducers[4],
    basket:                  reducers[5],  
    order:                   reducers[6],  
    market:                  reducers[7],
    search:                  reducers[8],
    orders:                    orReducer, //reducers[9],  
    category:               reducers[10],  
    sub:                    reducers[11],  
    gcard:                  reducers[12],
    actions:                reducers[13],
    action:                 reducers[14],
    param:                  reducers[15], 
    load:                   reducers[16],   
    progress:               reducers[17],
    logs:                   reducers[18],
    error:                  reducers[19],
    lstore:                 reducers[20]
})


function                gdReducer(state:any = i_state.goods, action){
    switch(action.type) {
        case "goods": {    
            let jarr: any = []
                action.goods.forEach(elem => {
                    var Ind = state.findIndex(function(b) { 
                        return b.Код === elem.Код; 
                    });
                    if( Ind >= 0)
                        state[ Ind ] = elem
                    else 
                        jarr = [...jarr, elem]
                });
            return [...state, ...jarr]
            //return [...state, ...action.goods1]
        }
        case "sav_goods": {    
            let jarr: any = []
                action.goods.forEach(elem => {
                    var Ind = state.findIndex(function(b) { 
                        return b.Код === elem.Код; 
                    });
                    if( Ind >= 0)
                        state[ Ind ] = elem
                    else 
                        jarr = [...jarr, elem]
                });
            return [...state, ...jarr]
            //return [...state, ...action.goods1]
        }
        case "price": {
                action.goods.forEach(elem => {
                    var Ind = state.findIndex(function(b) { 
                        return b.Код === elem.Код; 
                    });
                    if( Ind >= 0) {
                        state[ Ind ].Количество     = elem.Количество
                        state[ Ind ].Цена           = elem.Цена
                        state[ Ind ].СтараяЦена     = elem.СтараяЦена
                    }
                });

            return state
 
        }
        default: return state
    }
}

function                orReducer(state:any = i_state.orders, action){
    switch(action.type) {
        case "orders": {    
            return action.orders
        }
        default: return state
    }
}

export const Store      =  create_Store(rootReducer, i_state)

export const URL1C      = "https://marketac.ru:49002/ut/hs/API/V1/"

export const URL        = "https://marketac.ru:49002/node/"

//export const URL1C      = "https://46.48.133.250:49002/marketac/hs/API/V1/"

//export const URL        = "https://46.48.133.250:49002/node/"

export async function   getDatas(){
}


export async function download( ){
    let page = 0
    let dat_ = Store.getState().load;
    Store.dispatch({type: "load", load: "" })

    let res = await getData("method", {
        method:     "П_Картинки",    
        page:       page,
        _date:      dat_
    })  
    while(res.length > 0){ page = page + 1
        res.forEach(elem => {
            localForage.setItem("asmrkt." + elem.Код, elem.Картинка)
            console.log(elem.Код)
        });
        res = await getData("method", {
            method:     "П_Картинки",    
            page:       page,
            _date:      dat_
        })      
    } 
        localStorage.setItem("asmrkt.timestamp"
            ,  new Date().toISOString().substring(0, 10) + " " + new Date().toISOString().substring(12, 19)
        );

    Store.dispatch({type: "load", load: ""})
}

export function setToken(token) {
    let auth = Store.getState().auth;
    if( auth ) {
        getData("method", {
            method:     "Токен",
            phone:      Store.getState().login.code,
            token:      token.value,
        })
    }
}

export function Phone(phone): string {
    if(phone === undefined) return ""
    if(phone === null) return ""
    let str = "+7"
    for(let i = 0;i < phone.length;i++){
      let ch = phone.charCodeAt(i)
      if( ch >= 48 && ch <= 57) str = str + phone.charAt(i)
    }
    return str
}


export async function Check(good){
    let res = await getData("method", {method: "Товар", Код: good.Код})
    if(res.length > 0)  return res[0]
    else return {"Код": good.Код, "Количество": 0 }
}

let timerId;


export async function getOrders(){
    Orders();
    timerId = setInterval(() => {
        if(Store.getState().load === "")  Orders()        
    }, 60000);
  
}


async function Orders(){
    let login = Store.getState().login
    
    if(login.code !== "") {
        let res = await getData("method", {
            method: "Заказы",
            phone: Store.getState().login.code
        })   
        console.log(res)
        if(Array.isArray(res))
            Store.dispatch({type: "orders", orders: res})
        else 
            Store.dispatch({type: "orders", orders: []})
    }
}

export function stopOrders(){

      setTimeout(() => { clearInterval(timerId) });

}

// function logs(st: string){

//     let logs = Store.getState().logs;
//     Store.dispatch({type: "logs", logs: [...logs, st]})
//     console.log(st);
// }

function setForage(){
    try {

        localForage.config({
            driver      : localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
            name        : 'asrmrkt',
            version     : 1.0,
            size        : 1024*1024*512, // Size of database, in bytes. WebSQL-only for now.
            storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
            description : 'some description'
        });
        
        console.log("IndexedDB")    
    } catch (error) {
        try {
            localForage.config({
                driver      : localForage.WEBSQL, // Force WebSQL; same as using setDriver()
                name        : 'asrmrkt',
                version     : 1.0,
                size        : 1024*1024*512, // Size of database, in bytes. WebSQL-only for now.
                storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
                description : 'some description'
            });
            console.log("WebSQL")    
        } catch (error) {
            try {
                localForage.config({
                    driver      : localForage.LOCALSTORAGE, // Force WebSQL; same as using setDriver()
                    name        : 'asrmrkt',
                    version     : 1.0,
                    size        : 1024*1024*512, // Size of database, in bytes. WebSQL-only for now.
                    storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
                    description : 'some description'
                });
                console.log("LocalStorage")    
        
            } catch (error) {
                Store.dispatch({type : "lstore", lstore : false})
                console.log( error )        
                Store.dispatch({type: "error", error: "Ошибка локального хранилища { INDEXEDDB }"})                
            }
        }
    }

}


async function exec(){
    
    console.log("exec")
     
    setForage()

    let _dat = await localForage.getItem("asmrkt.timestamp") as string

    if( _dat === null )
        _dat = "2021-01-01 00:00:00";
    Store.dispatch({
        type: "load", 
        load:  _dat, //new Date().toISOString().substring(0, 10) + " " + new Date().toISOString().substring(12, 19)
    })
    
    let sav = await localForage.getItem("asmrkt.login");
    if(sav !== null){
        getProfile( sav )
    }

    sav = await localForage.getItem("asmrkt.market");
    if(sav === null){
        getMarket( true )
    } else {
        Store.dispatch({type: "market", market: sav})  
        getMarket( false )
    }
    
    sav = await localForage.getItem("asmrkt.actions");
    if(sav === null){
        getActions( true )
    } else {
        Store.dispatch({type: "actions", actions: sav})  
        getActions( false )
    }
    
    sav = await localForage.getItem("asmrkt.categories");
    if(sav === null){
        getCategories( true )
    } else {
        Store.dispatch({type: "categories", categories: sav})  
        getCategories( false )
    }

    sav = await localForage.getItem("asmrkt.goods");
    if(sav === null){
        getGoods( true )
    } else {
        Store.dispatch({type: "goods", goods: sav})  
        getGoods( false )
    }
    
    download( )

    getOrders();


}

exec();

async function  getMarket( redux: boolean ){
    let res = await getData("method", {method: "Настройки"}) 
    let market = res[0]
    if(market !== undefined) {
        market.tabs = JSON.parse(market.tabs)
        localForage.setItem("asmrkt.market", market)
        if( redux )
            Store.dispatch({type: "market", market: market})
    }

}

async function  getActions( redux: boolean ){
    let res = await getData("method", {method: "Акции"}) 
    if(Array.isArray(res)) {
        localForage.setItem("asmrkt.actions", res)
        if( redux )
            Store.dispatch({type: "actions", actions: res})
    }

}

async function  getCategories( redux: boolean ){
    let res = await getData("method", {method: "Категории"}) 
    if(Array.isArray(res)) {
        let cats = res.map((e) => {e.Категории = JSON.parse(e.Категории); return e })
        localForage.setItem("asmrkt.categories", cats)
        if( redux )
            Store.dispatch({type: "categories", categories: cats})
    }

}

async function  getGoods( redux: boolean ){
    let res = await getData("method", {method: "Продукты"}) 
    if(Array.isArray(res)) {
        localForage.setItem("asmrkt.goods", res)
        if( redux )
            Store.dispatch({type: "goods", goods: res})
    }

}

async function getProfile( login ){
    Store.dispatch({type: "auth", auth: true });
    let res = await getData("method", {
            method: "Профиль",
            phone:  login.code,
        })
    if(res[0] !== undefined) {
        let login = res[0];login.type = "login"
        Store.dispatch( login )
    } 
}

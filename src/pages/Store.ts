import { combineReducers  } from 'redux'
import axios from 'axios'
import { Reducer } from 'react';
import { constructSharp, contrastOutline } from 'ionicons/icons';
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
            OrderDetails:           []

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

export async function   getDatas(){
}

Store.subscribe({num: 10001, type: "goods", func: ()=>{
    let goods = Store.getState().goods;  
    let ind = 0;
    let jarr = goods.slice(ind * 100, (ind + 1) * 100);
    while(jarr.length > 0){ ind = ind + 1
        console.log("goods" + ind.toString())
        localForage.setItem("goods" + ind.toString(), JSON.stringify(jarr) );
        jarr = goods.slice(ind * 100, (ind + 1) * 100);
    }

    deleteSav( ind + 1 )

}})

Store.subscribe({num: 10002, type: "price", func: ()=>{
    let goods = Store.getState().goods;  
    let ind = 0;
    let jarr = goods.slice(ind * 100, (ind + 1) * 100);
    while(jarr.length > 0){ ind = ind + 1
        console.log("goods" + ind.toString())
        localForage.setItem("goods" + ind.toString(), JSON.stringify(jarr) );
        jarr = goods.slice(ind * 100, (ind + 1) * 100);
    }

    deleteSav( ind + 1 )

}})

async function deleteSav( ind ){
    
    let sav = await localForage.getItem("goods" + ind.toString());
    if(sav !== undefined && sav !== null) {
        console.log("deleted goods" + ind.toString())
        localForage.setItem("goods" + ind.toString(), '[]');
        deleteSav( ind + 1 )
    } 
}

export async function download( page, _dat ){

    let res = await getData("method", {
        method:     "Р_Продукты",    
        page:       page,
        _date:      _dat
    })  
    console.log(res)
    if(res.length > 0){
        Store.dispatch({ type: "goods", goods: res })
        download( page + 1, _dat )
    } else {
        res = await getData("method", {
            method:     "Прайс",
            _date:      _dat,    
        })
        console.log("Прайс")
        if(res.length > 0) Store.dispatch({type: "price", goods: res})
        localStorage.setItem("asmrkt.timestamp",  Store.getState().load);
        Store.dispatch({type: "load", load: ""})
    }

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
    console.log(login)
    console.log( Store.getState().auth )
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
    }, 15000);
  
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



async function exec(){
     
    console.log( new Date().toISOString().substring(0, 10) + " " + new Date().toISOString().substring(12, 19))

    let res: any

    console.log("---------")

    let _dat = localStorage.getItem("asmrkt.timestamp") as string
    console.log(_dat)
    if( _dat === null || _dat === undefined )
        _dat = "2021-01-01 00:00:00";
    Store.dispatch({
        type: "load", 
        load: new Date().toISOString().substring(0, 10) + " " + new Date().toISOString().substring(12, 19)
    })


    let phone = localStorage.getItem("marketAs.login")
    console.log(phone)
    if((phone !== undefined) && (phone !== null)) 
        getProfile(phone)


    localForage.config({
        driver      : localForage.WEBSQL, // Force WebSQL; same as using setDriver()
        name        : 'asrmrkt',
        version     : 1.0,
        size        : 1024*1024*512, // Size of database, in bytes. WebSQL-only for now.
        storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
        description : 'some description'
    });

    console.log("exec")
    let sav = localStorage.getItem("asmrkt.market");
    if(sav !== undefined && sav !== null) {
        sav = JSON.parse(sav);
        Store.dispatch({type: "market", market: sav})
        console.log("Настройки")
    }

    sav = localStorage.getItem("asmrkt.actions");
    if(sav !== undefined && sav !== null) {
        sav = JSON.parse(sav);
        Store.dispatch({type: "actions", actions: sav})
        console.log("Акции")
    }

    sav = localStorage.getItem("asrmkt.categories");
    if(sav !== undefined && sav !== null) {
        sav = JSON.parse(sav);
        Store.dispatch({type: "categories", categories: sav })
        console.log("Категории")
    }

    let ok = true;let page = 0;
    while( ok ) { 
        page = page + 1;
        sav = await localForage.getItem("goods" + page.toString());
        if(sav !== undefined && sav !== null) {
            sav = JSON.parse(sav);
            Store.dispatch({type: "sav_goods", goods: sav })
        } else ok = false
        console.log(page)
    }

    let goods = Store.getState().goods

    console.log("--------------------------")

    res = await getData("method", {method: "Настройки"}) 
    let market = res[0]
    market.tabs = JSON.parse(market.tabs)

    localStorage.setItem("asmrkt.market", JSON.stringify(res))
    Store.dispatch({type: "market", market: res})

    res = await getData("method", {method: "Акции"})
    localStorage.setItem("asmrkt.actions", JSON.stringify(res))
    Store.dispatch({type: "actions", actions: res})  

    res = await getData("method", {method: "Категории"})
    
    let cats1 = res.map((e) => {e.Категории = JSON.parse(e.Категории); return e })
    localStorage.setItem("asrmkt.categories", JSON.stringify(cats1))
    Store.dispatch({type: "categories", categories: cats1})  
    
    download( 1, _dat )

    getOrders();


}

exec();

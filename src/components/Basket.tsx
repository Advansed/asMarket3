import { IonButton, IonCol, IonGrid, IonIcon, IonLabel, IonRow, IonText} from '@ionic/react';
import { arrowBackOutline, closeOutline, infiniteOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { Store } from '../pages/Store';
import './Basket.css';

export function BasketIcon():JSX.Element {
    const [info, setInfo] = useState(0)

    Store.subscribe({num: 31, type: "basket", func: ()=>{
        setInfo(Store.getState().basket.length)
    }})
    useEffect(()=>{
        setInfo(Store.getState().basket.length)
    }, [])

    let elem = <>
        <div className="bs-icon"
            onClick = {()=>{
                Store.dispatch({type: "route", route: "/page/basket"})
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
            </svg>
            <IonLabel class="bs-red"><b>{ info }</b></IonLabel>
        </div>
    </>

    return elem
}



function  delBasket(Код){
    let basket = Store.getState().basket;
  
    if(basket === undefined) basket = [];
  
    var commentIndex = basket.findIndex(function(b) { 
        return b.Код === Код  
    });
    if(commentIndex >= 0){
      basket.splice(commentIndex, 1)
      Store.dispatch({type:"basket", basket: basket})
    }
  }
  
    
  export function   addBasket( good, amount ){
    let basket = Store.getState().basket;
    if(basket === undefined) basket = [];
    var commentIndex = basket.findIndex(function(b) { 
        return b.Код === good.Код; 
    });
    if(commentIndex >= 0){
  
      let sum   = basket[commentIndex].Количество + amount;
      if(sum < 0) sum = 0
      let total = basket[commentIndex].Цена * sum;
  
      if(sum === 0) delBasket(good.Код)
      else {
        let bask = basket.map(todo => {
          if (todo.Код === good.Код) {
            return { ...todo, Количество: sum, Сумма: total}
          } else {
            return todo
          }
        })
        Store.dispatch({type: "basket", basket: bask})
    
      }
  
    } else {
      basket = [...basket, {
        Код:            good.Код,
        Наименование:   good.Наименование,
        Цена:           good.Цена,
        Количество:     amount,
        Сумма:          amount * good.Цена,
        Упаковка:       good.Уп,
        Картинка:       good.Картинка
        
    }]
  
      Store.dispatch({type: "basket", basket: basket})
    }
  }
  
  export function   Basket(props):JSX.Element {
      const [upd, setUpd] = useState(0)
      const [basket,  setBasket] = useState<any>(Store.getState().basket)
    
      // Store.subscribe({num: 41, type: "basket", func: ()=>{
      //   setBasket(Store.getState().basket)
      // }})
    
      useEffect(()=>{
    
        setBasket(Store.getState().basket)
    
      },[upd]) 
    
  
      function  updBasket(Код: number, amount: number){
          let basket = Store.getState().basket;
          console.log("Код = " + Код.toString() + " Количество = " + amount.toString())
          if(basket === undefined) basket = [];
      
          var commentIndex = basket.findIndex(function(b) { 
              return b.Код === Код
          });
          if(commentIndex >= 0){
            let b_amount = basket[commentIndex].Количество
            console.log(" Количество = " + b_amount.toString())
            let sum = b_amount + amount;
            console.log(" Количество  + 1 = " + sum.toString())
            let total = basket[commentIndex].Цена * sum;
  
            if(sum < 0) sum = 0
      
            if(sum === 0) delBasket(Код)
            else {
              let bask = basket.map(todo => {
                if (todo.Код === Код) {
                  return { ...todo, Количество: sum, Сумма: total}
                } else {
                  return todo
                }
              })
              Store.dispatch({type: "basket", basket: bask})
              console.log(bask)
              console.log("basket")

            }
      
          }
      }

     
      
      function  BItem(props):JSX.Element{  
          const [info, setInfo] = useState(props.info)
          const [upd1, setUpd1] = useState(0)
          //let info                = props.info;
          let Количество          = info.Количество 
  
          return <>
            
            <IonRow class="r-underline ">
              <IonCol size="1">
                    
                    <IonIcon icon={ closeOutline } className="b-size-btnx" 
                        onClick={()=>{
                          delBasket(info.Код); setUpd(upd + 1);
                        }} 
                    />
              
              </IonCol>
              <IonCol size="2">
                <div className="basketimg">
                  <img className="" src={  info.Картинка } alt="" />
                </div>
              </IonCol>
              <IonCol size="9" className="ml-0.5">
                <IonRow>
                  <h1 className="basketnameofgood"><b>{info.Наименование}</b></h1>
                </IonRow>    
                <IonRow //className="mt-1"
                >
                  <button  className="white-bg text-align orange-clr-fnt mr-2"> 
                    { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info.Цена * Количество)  }
                  </button>
                  <IonButton className="bs-size-btn left" color="new" 
                    onClick = {(e)=>{
                      
                      if(info.Количество > 0){
                        updBasket( info.Код, -1 )
                        info.Количество = info.Количество - 1
                        setInfo( info )
                        setUpd1( upd1 + 1 );
                      } else {
                        delBasket(info.Код)
                        setUpd(upd + 1);
                      }
                    }}
                  >-
                  </IonButton>
                  <button  className="white-bg text-align "> 
                    <h5 className="bs-quan">{ Количество.toFixed() + " шт."} </h5>
                  </button>
                  <IonButton className="bs-size-btn " color="new" 
                    onClick = {(e)=>{
                        updBasket( info.Код, 1 )
                        info.Количество = info.Количество + 1;
                        setInfo(info);
                        setUpd1( upd1 + 1 );
                    }}
                  >+
                  </IonButton>
                </IonRow>
              </IonCol>
            </IonRow>
          </>
        
      }
    
      let b_length = 0;
    
      for(let i = 0;i < basket.length;i++){
        b_length = b_length + basket[i].Количество;
      }  
    
      let items = <></>

      

      let sum = 0;
      for(let i = 0;i < basket.length;i++){
        sum = sum + basket[i].Сумма;
        items = <>
          { items }
          <BItem info={ basket[i] } />
        </>
      }
      
      let delivery=0;
      if(sum>=0 && sum<=999){
        delivery=150;
      }else if(sum>=1000 && sum<=1499) delivery=100
      else if (sum>=1500 && sum<=1999) delivery=50
      else delivery=0
      let sumtotal=0;
      sumtotal=sum+delivery;

      return <>
        <div>
          <IonGrid className="w-100 header">
              <IonRow>
                <IonCol size="1">
                  <button 
                      onClick = {()=>{
                      Store.dispatch({type: "route", route: "back"})
                    }} className="btn"
                  > 
                    <IonIcon className="b-size-btnx" icon = { arrowBackOutline } />
                  </button>
                </IonCol>
                <IonCol size="6" >
                <button  className="header btn"
> 
                    <h4 className="header-font"><b>Корзина</b></h4>
                  </button>
                </IonCol>                
                <IonCol size="5">
                  <button  className="header btn"
                      onClick = {()=>{
                      Store.dispatch({type: "basket", basket: []})
                      setBasket([]);
                    }}
                  > 
                    <h4 className="header-font2">Очистить всё</h4>
                  </button>
                </IonCol> 
              </IonRow>        
            </IonGrid>
        </div>            
        
          <div className="content">
              { items }
          </div>
          <div className="footer">
            <div className="footer2 ">
            <IonRow>
              <IonCol size="6">
                <div className="left">
                  <IonText class="basketnameofgood ml-1">
                    <b>Итого </b>
                  </IonText>
                </div>
              </IonCol>
              <IonCol size="6">
                <div className="right orange-clr-fnt">
                <IonText class="basketnameofgood ml-1">
                 <b>{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(sum)  }</b>
                 </IonText>
                </div>
              </IonCol>
            </IonRow>
            </div>
            
            <IonRow>
                <div className="btn">
                  <button
                    slot="end"
                    onClick={()=>{
                      Store.dispatch({type: "route", route: "/page/order"})
                    }}  className="orange-clr-bg"
                  >
                    Оформить заказ
                  </button>
                </div>
            </IonRow> 
          </div>
        
       </>
  }

  export function   count(info){
    if(info === undefined) return 0;
    let basket = Store.getState().basket;
    var commentIndex = basket.findIndex(function(b) { 
      return b.Код === info.Код; 
    });
    if(commentIndex >= 0)
      return basket[commentIndex].Количество
    else 
      return 0
  }
  
  export function   total(info){
    let basket = Store.getState().basket;
    var commentIndex = basket.findIndex(function(b) { 
      return b.Код === info.Код; 
    });
    if(commentIndex >= 0)
      return basket[commentIndex].Сумма
    else 
      return 0
  }
  
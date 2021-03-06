import { IonButton, IonCol, IonIcon, IonLabel, IonRow, IonText, IonAlert} from '@ionic/react';
import { cartOutline, checkmarkOutline, closeCircleOutline, closeOutline, trashBinOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { Store } from '../pages/Store';
import './Basket.css';

export function   BasketIcon():JSX.Element {
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

function          delBasket(Код){
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
      if(sum > good.Количество ) sum = good.Количество
      console.log(sum)
      let total = basket[commentIndex].Цена * sum;

      let СуммаСкидки = ((good.СтараяЦена === 0 ? good.Цена : good.СтараяЦена) - good.Цена) * sum;
  
      if(sum === 0) delBasket(good.Код)
      else {
        let bask = basket.map(todo => {
          if (todo.Код === good.Код) {
            return { ...todo, Количество: sum, Сумма: total, СуммаСкидки: СуммаСкидки}
          } else {
            return todo
          }
        })
        Store.dispatch({type: "basket", basket: bask})
    
      }
  
    } else {
      if(good.Количество > 0){
        basket = [...basket, {
          Код:            good.Код,
          Наименование:   good.Наименование,
          Цена:           good.Цена,
          СтараяЦена:     good.СтараяЦена,
          Максимум:       good.Количество,  
          Количество:     amount,
          Сумма:          amount * good.Цена,
          СуммаСкидки:    amount * ((good.СтараяЦена === 0 ? good.Цена : good.СтараяЦена)  - good.Цена),
          Упаковка:       good.Уп,
          Картинка:       good.Картинка
        }]
      }
  
      Store.dispatch({type: "basket", basket: basket})
    }
}
  
export function   Basket(props):JSX.Element {
      const [upd, setUpd] = useState(0)
      const [alert, setAlert] = useState(false)
      const [basket,  setBasket] = useState(Store.getState().basket)

    
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
            let sum = b_amount + amount;
            let total = basket[commentIndex].Цена * sum;
            let СуммаСкидки = ((basket[commentIndex].СтараяЦена === 0 ? basket[commentIndex].Цена : basket[commentIndex].СтараяЦена) - basket[commentIndex].Цена) * sum;
  

            if(sum < 0) sum = 0
      
            if(sum === 0) delBasket(Код)
            else {
              let bask = basket.map(todo => {
                if (todo.Код === Код) {
                  return { ...todo, Количество: sum, Сумма: total, СуммаСкидки: СуммаСкидки}
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

      function    Proov(){
        
        let ok = true
        basket.forEach(info => {
          if(info.Количество > info.Максимум) ok = false;
        });
        
        if(ok)
          Store.dispatch({type: "route", route: "/page1/order"})
        else setAlert(true)
      
      }
      
      function  BItem(props):JSX.Element{  
          const [info, setInfo] = useState(props.info)
          const [upd1, setUpd1] = useState(0)
          let Количество          = info.Количество 
  
          return <>
            <div className="r-underline flex">
              <div>
                <img className="w-3 h-3" src={  info.Картинка } alt="Картинка" />
              </div>
              <div className="w-100 flex">
                <div className="w-100">
                  <div><h1 className="basketnameofgood ml-1"><b>{info.Наименование}</b></h1></div>
                  <div className="flex">
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

                  </div>
                </div>
                <div className="w-3">
                  <IonIcon icon={ closeOutline } className="b-size-btnx" 
                        onClick={()=>{
                          delBasket(info.Код); setUpd(upd + 1);
                        }} 
                  />
                   <IonIcon 
                          icon={ info.Количество <= info.Максимум ? checkmarkOutline : closeCircleOutline } 
                          color = { info.Количество <= info.Максимум ? "success" : "danger" }
                          className="b-size-btnx" 
                          onClick={()=>{
                          }} 
                      />
                </div>
              </div>
            </div>
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
      
      return <>
          <div className="b-content">
              { items }
          </div>
          <div className="footer">
            <div className="footer2 ">
              <Summary />
            </div>
            
            <IonRow>
                <div className="btn">
                  <button
                    slot="end"
                    onClick={()=>{
                      Proov()                
                    }}  className="orange-clr-bg"
                  >
                    Оформить заказ
                  </button>
                </div>
            </IonRow> 
          </div>
          <IonAlert
            isOpen={ alert }
            onDidDismiss={() => setAlert(false)}
            cssClass='my-custom-class'
            header={'Ошибка'}
            message={ "Не хватает товаров" }
            buttons={['OK']}
          />

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

function Summary() :JSX.Element{
  const [ sum ]   = useState({
    sum:        0,
    sum1:       0,
    del:        0,
  });
  const [upd,  setUpd]  = useState(0);

  Store.subscribe({num: 34, type: "basket", func: ()=>{
    let jarr = Store.getState().basket;
    console.log(jarr)
    sum.sum = 0;
    sum.sum1 = 0;
    sum.del = 0;
    jarr.forEach(el => {
      sum.sum   = sum.sum   + el.Сумма 
      sum.sum1  = sum.sum1  + el.СуммаСкидки
    });
    
    let tabs = Store.getState().market.tabs;
    sum.del = sum.sum;    
    for(let i = 0; i < tabs.length; i++){
      if(tabs[i].sum <= sum.sum) {
        sum.del = tabs[i].del
      }
    }

    if(sum.sum === 0 ) sum.del = 0;

    setUpd(upd + 1)
  }})

  useEffect(()=>{
    let jarr = Store.getState().basket;
    console.log(jarr)
    sum.sum = 0;
    sum.sum1 = 0;
    sum.del = 0;
    jarr.forEach(el => {
      sum.sum   = sum.sum   + el.Сумма 
      sum.sum1  = sum.sum1  + el.СуммаСкидки
    });
    
    let tabs = Store.getState().market.tabs;
    sum.del = sum.sum;    
    for(let i = 0; i < tabs.length; i++){
      if(tabs[i].sum <= sum.sum) {
        sum.del = tabs[i].del
      }
    }

    if(sum.sum === 0 ) sum.del = 0;

    setUpd(upd + 1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  let elem = <>
    <div>
      <IonRow>
        <IonCol>
          <div className="left">
            <IonText class="basketnameofgood ml-1">
              <b>Сумма доставки </b>
            </IonText>
          </div>
        </IonCol>
        <IonCol>
          <div className="right orange-clr-fnt">
            <IonText class="basketnameofgood ml-1">
              <b>{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( sum.del )  
              }</b>
            </IonText>
          </div>
        </IonCol>
      </IonRow>
    </div>
    <div>
      <IonRow>
        <IonCol>
          <div className="left">
            <IonText class="basketnameofgood ml-1">
              <b>Сумма скидок </b>
            </IonText>
          </div>
        </IonCol>
        <IonCol>
          <div className="right orange-clr-fnt">
            <IonText class="basketnameofgood ml-1">
              <b>{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( sum.sum1 )  
              }</b>
            </IonText>
          </div>
        </IonCol>
      </IonRow>
    </div>
    <div>
      <IonRow>
        <IonCol>
          <div className="left">
            <IonText class="basketnameofgood ml-1">
              <b>Сумма заказа </b>
            </IonText>
          </div>
        </IonCol>
        <IonCol>
          <div className="right orange-clr-fnt">
            <IonText class="basketnameofgood ml-1">
              <b>{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( sum.sum )  
              }</b>
            </IonText>
          </div>
        </IonCol>
      </IonRow>
    </div>
  </>
  return elem
}
  
export function   BasketPanel():JSX.Element {
  const [amount,  setAmount]  = useState(0);
  const [sum,     setSum]     = useState(0);

  Store.subscribe({num: 32, type: "basket", func: ()=>{
    let basket = Store.getState().basket;
    let sum = 0; let total = 0;
    for(let i = 0;i < basket.length;i++) {
      sum = sum + basket[i].Количество;
      total = total + basket[i].Сумма;
    }
    setAmount(sum);setSum(total);
}})

  useEffect(()=>{
    let basket = Store.getState().basket;
    let sum = 0; let total = 0;
    for(let i = 0;i < basket.length;i++) {
      sum = sum + basket[i].Количество;
      total = total + basket[i].Сумма;
    }
    setAmount(sum);setSum(total);
  },[])
  let elem = <>
    <div className = { "b-panel" + ( sum === 0 ? " hidden" : "")}>
      <div className= "w-10"
        onClick= {()=>{
          Store.dispatch({type: "route", route: "/page1/basket"})
        }}
      >
        <IonIcon className = "bs-icon-1" icon = { cartOutline }/>
      </div>
      <div className= "w-80"
        onClick= {()=>{
          Store.dispatch({type: "route", route: "/page1/basket"})
        }}
      >
        <div className= "ml-1">
          Количество товаров - { amount } шт
        </div>
        <div className= "ml-1">
          На сумму - { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( sum ) } 
        </div>
      </div>
      <div className= "w-10"
        onClick = {()=>{
          Store.dispatch({type: "basket", basket: []})
        }}
      >
        <IonIcon className = "bs-icon-1" icon = { trashBinOutline }/>
      </div>
    </div>
  </>
  return elem
}

export function   BasketPanel1():JSX.Element {
  const [amount,  setAmount]  = useState(0);
  const [sum,     setSum]     = useState(0);

  Store.subscribe({num: 33, type: "basket", func: ()=>{
    let basket = Store.getState().basket;
    let sum = 0; let total = 0;
    for(let i = 0;i < basket.length;i++) {
      sum = sum + basket[i].Количество;
      total = total + basket[i].Сумма;
    }
    setAmount(sum);setSum(total);
}})

  useEffect(()=>{
    let basket = Store.getState().basket;
    let sum = 0; let total = 0;
    for(let i = 0;i < basket.length;i++) {
      sum = sum + basket[i].Количество;
      total = total + basket[i].Сумма;
    }
    setAmount(sum);setSum(total);
  },[])

  let elem = <>
    <div className = { "b-panel" + ( sum === 0 ? " hidden" : "")}>
      <div className= "w-10"
        onClick= {()=>{
          Store.dispatch({type: "route", route: "/page1/basket"})
        }}
      >
        <IonIcon className = "bs-icon-1" icon = { cartOutline }/>
      </div>
      <div className= "w-80"
        onClick= {()=>{
          Store.dispatch({type: "route", route: "/page1/basket"})
        }}
      >
        <div className= "ml-1">
          Количество товаров - { amount } шт
        </div>
        <div className= "ml-1">
          На сумму - { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( sum ) } 
        </div>
      </div>
      <div className= "w-10"
        onClick = {()=>{
          Store.dispatch({type: "basket", basket: []})
        }}
      >
        <IonIcon className = "bs-icon-1" icon = { trashBinOutline }/>
      </div>
    </div>
  </>
  return elem
}
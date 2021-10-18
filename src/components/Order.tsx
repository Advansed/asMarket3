import { IonAlert, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol
  , IonIcon, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { setErrorHandler } from "ionicons/dist/types/stencil-public-runtime";
import { arrowBackOutline, bicycleOutline, businessOutline, cardOutline, cashOutline, homeOutline, phonePortrait, storefrontOutline } from "ionicons/icons";
import { setUncaughtExceptionCaptureCallback } from "process";
import { useEffect, useState } from "react";
import { AddressSuggestions } from "react-dadata";
import MaskedInput from "../mask/reactTextMask";
import { getData1C, Store } from "../pages/Store";
import './Order.css'
import { IPAY, ipayCheckout } from './sber'

declare type Dictionary = {
    [key: string]: any;
  };

const info = {
  StatusId:         0,
  Order_No:           "",
  Phone:            "",
  Address:          "",
  CustomerName :    "",
  DeliveryMethod:   "",
  DeliveryTime:     "",
  PaymentMethodId:  "",
  CustomerComment:  "",
  PaymentStatus:    0,
  Total:            0,
  DelivSum:         0,
  OrderDetails:     []
}

export function   Order( props ):JSX.Element {
    const [message,   setMessage] = useState("")
    const [mp,        setMP]      = useState(true)
    const [dost,      setDost]    = useState(true)
    const [upd,       setUpd]     = useState(0)
    const [deliv,     setDeliv]   = useState(0)
    const [choice,    setChoice]  = useState(false)


    useEffect(()=>{
        let sum = Store.getState().basket.reduce(function(a, b){ return a + b.Сумма;}, 0)
        info.Phone =           Store.getState().login.code
        info.CustomerName =    Store.getState().login.name
        info.Total =           sum
        info.DelivSum =        sum >= 1000 ? 0 : Store.getState().market.sum
        info.OrderDetails =    Store.getState().basket.map(e =>{
          return {
              ProductId:  e.Код, 
              Name:       e.Наименование, 
              Weight:     e.Вес, 
              Amount:     e.Количество, 
              Price:      e.Цена, 
              Total:      e.Сумма}
        })
    },[])

    let item : Dictionary = {"city": "Якутск"};
    let dict : Dictionary[] = []; dict.push(item);

    function phone(st){
      if(st !== undefined) {
        if(st.length > 2)
          return st.substring(2)
      } else return ""
    }

    function        showSuccessfulPurchase(){
      setDeliv(1)  
    }
  
    function        showFailurefulPurchase(){
      setChoice(true)
    }


    function Page1():JSX.Element {
      
      let elem = <>
      
      <IonCardHeader>
          <div className="row">
            
          <IonCol size="1" >
          <button 
            onClick={()=>{
              Store.dispatch({type: "route", route: "back"})
            }} className="btn2 left-align"
          >
            <IonIcon icon = { arrowBackOutline }  />
          </button>
          </IonCol>
          
          <IonCol size="9">
            <div className="header-name"> 
           <b>Оформление заказа </b> 
           </div>
            </IonCol>
            </div>
        </IonCardHeader >
        <IonCardContent className="order-content">
          {/* Оплата */}
          <IonItem> 
            <IonIcon slot="start" icon={ cardOutline } />
            <IonLabel position="stacked">Оплата</IonLabel>
            <IonSelect value={ info.PaymentMethodId } okText="Да" cancelText="Нет" onIonChange={e => {
                info.PaymentMethodId = e.detail.value
                if(info.PaymentMethodId === "Эквайринг") setMP(true)
                else setMP(false)
            }}>
              <IonSelectOption value="Эквайринг">Эквайринг</IonSelectOption>
              <IonSelectOption value="наличными">Наличными</IonSelectOption>
              <IonSelectOption value="картой">Картой</IonSelectOption>
              {/* <IonSelectOption value="посчету">По счету</IonSelectOption> */}
            </IonSelect>
          </IonItem>
          {/* Телефон */}
          <IonItem>
            <IonIcon slot= "start" icon={ phonePortrait }/>
            <IonLabel position="stacked">Телефон</IonLabel>
            <div className="o-phone">
              <div>+7</div>
              <div>
                <MaskedInput
                  mask={[ ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                  className="m-input"
                  autoComplete="off"
                  placeholder="(___) ___-__-__"
                  id='1'
                  type='text'
                  value = { phone(info?.Phone) }
                  onChange={(e: any) => {
                    let st = e.target.value;
                    info.Phone = "+7" + st;
                  }}
                />
              </div>
            </div>
          </IonItem>
          {/* Доставка */}
          <IonItem>
            <IonIcon slot="start" icon={ bicycleOutline } />
            <IonLabel position="stacked">Доставка</IonLabel>
            <IonSelect value={ info?.DeliveryMethod } okText="Да" cancelText="Нет" onIonChange={e => {
                info.DeliveryMethod = e.detail.value
                if(info.DeliveryMethod === "Доставка") {
                  info.Address = "";
                  info.DelivSum = info.Total  < 1000 ? Store.getState().market.sum : 0
                  setDost(true); 
                  
                } else {
                  info.Address = "";
                  info.DelivSum = 0;
                  setDost(false)
                }
                Store.dispatch({type: "order", order: info})
              
            }}>
              <IonSelectOption value="Доставка">Доставка до адреса</IonSelectOption>
              <IonSelectOption value="Самовывоз">Самовывоз</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className = { dost ? "" : "hidden"}>
            <div className="ml-2 mt-4"><IonLabel>Адрес</IonLabel></div>
            
              <AddressSuggestions
                token="23de02cd2b41dbb9951f8991a41b808f4398ec6e"
                filterLocations ={ dict }
                hintText = { "г. Якутск" }
                onChange={(e)=>{
                  if(e !== undefined)
                    info.Address = e.value
                }}
              /> 
          </div>
        <IonCardHeader className="header-name "><b> Итоги по заказу</b> </IonCardHeader>   
          <IonList class="f-14">
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Доставка </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.Total + info?.DelivSum)
              } </IonLabel>
            </IonItem>
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Сумма товаров </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.Total) } </IonLabel>
            </IonItem>
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Итого </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.Total + info?.DelivSum)
              } </IonLabel>
            </IonItem>
          </IonList>
          <div className="footer-order">
         
         <div className="btn">
               <button
                  className = { mp ? "hidden" : "orange-clr-bg"}
                 slot="end"
                 onClick={()=>{
                   Proov();
                 }}  
               >
                  Заказать
               </button>
               <button slot="end" 
                  className = { mp ? "orange-clr-bg" : "hidden"}
                onClick={()=>{
                  Proov();
                }}>
              Оплатить
            </button>
          </div>
     
     </div>
        </IonCardContent>
        
      <IonAlert
            isOpen={ message !== "" }
            onDidDismiss={() => setMessage("")}
            cssClass='my-custom-class'
            header={'Ошибка'}
            message={ message }
            buttons={['OK']}
          />
  
      </>
      return elem
    }

    function Page2():JSX.Element {
      console.log("page2")
      let elem = <>
      
        <div className="order-image">
              <img src = "assets/okimg.png" />
        </div>
        <div className="order-clr">
          <div className="order-box">
          </div>
        </div>
        
        <div className="mt-3">
          <IonItem lines="none">
            <IonIcon slot="start" icon = { businessOutline }/>
            <IonLabel position="stacked"> Организация </IonLabel>
            <IonText><b> { Store.getState().market.name } </b></IonText>
          </IonItem>
        </div>
        <div>
          <IonItem lines="none">
            <IonIcon slot="start" icon = { bicycleOutline }/>
            <IonLabel position="stacked"> Доставка </IonLabel>
            <IonText><b> { info.DeliveryMethod } </b></IonText>
          </IonItem>
        </div>
        <div className={ info.DeliveryMethod === "Доставка" ? "" : "hidden"}>
          <IonItem lines="none">
            <IonIcon slot="start" icon = { homeOutline }/>
            <IonLabel position="stacked"> Адрес доставки </IonLabel>
            <IonText><b> { info.Address } </b></IonText>
          </IonItem>
        </div>
            <div className={ info.DeliveryMethod === "Доставка" ? "hidden" : ""}>
              <IonItem lines="none">
                <IonIcon slot="start" icon = { storefrontOutline }/>
                <IonLabel position="stacked"> Адрес получения </IonLabel>
                <IonText><b> { Store.getState().market.address } </b></IonText>
              </IonItem>
            </div>
            <div>
              <IonItem lines="none">
                <IonIcon slot="start" icon = { cashOutline }/>
                <IonLabel position="stacked"
                  className={ info.PaymentMethodId === "Эквайринг" ? "hidden" : ""}
                > Оплата { info.PaymentMethodId } </IonLabel>
                <IonText
                  className={ info.PaymentMethodId === "Эквайринг" ? "hidden" : ""}
                ><b> Заказано на сумму { info.Total + info.DelivSum } руб </b></IonText>
                <IonText
                  className={ info.PaymentMethodId === "Эквайринг" ? "" : "hidden"}
                ><b> Оплачено { info?.Total + info?.DelivSum } руб </b></IonText>
              </IonItem>
            </div>
            <div className={ info?.DeliveryMethod === "Доставка" ? "hidden" : ""}>
              <div className = "mr-1 ml-1">
                 <IonText class="f-14">
                    Вы можете забрать свой заказ с указанного адреса в рабочее время течение трех дней.
                    Потом заказ будет отменен. 
                   <span className={ info.PaymentMethodId === "Эквайринг" ? "" : "hidden"}>
                     Деньги будут возвращены на карту
                  </span>
                 </IonText>
               </div>
            </div>
            <div className={ info.DeliveryMethod === "Доставка" ? "" : "hidden"}>
              <div className = "mr-1 ml-1">
                <IonText class="f-14">
                  В ближайшее время с Вами свяжутся и обговорят время доставки заказа
                </IonText>
              </div>
            </div>
       
            
          
          
            <div className="footer-order">
         
         <div className="btn">
               <button
                 slot="end"
                 onClick={()=>{
                   Store.dispatch({type: "route", route: "/page/root"})
                 }}  className="orange-clr-bg"
               >
                 {"Закрыть"}
               </button>
             </div>
          
        </div>
                
      </>

      return elem
    }

    function Page3():JSX.Element {
      console.log("page2")
      let elem = <>
      
        <div className="order-image">
              <img src = "assets/errorimg.png" />
        </div>
        <div className="order-clr">
          <div className="order-box">
          </div>
        </div>
        <h1>
          Ошибка создания заказа!!
          Извините что то пошло не так
        </h1>
        <div className="footer-order"> 
         <div className="btn">
               <button
                 slot="end"
                 onClick={()=>{
                   Store.dispatch({type: "route", route: "/page/root"})
                 }}  className="orange-clr-bg"
               >
                 {"Закрыть"}
               </button>
             </div>
          
        </div>
                
      </>

      return elem
    }


    function Proov(){
      console.log(info)
      Store.dispatch({type: "order", order: info})

      if( dost && info.Address === "") 
        setMessage("Заполните адрес")
      else 
      if(info.Phone === "" || info.Phone.indexOf('_') > -1)
        setMessage("Заполните телефон")
      else 
        Order()
    }
  
    async function Order(){
      
      let res = await getData1C("Заказ", info);
      if(res.Код === "100") {
        info.Order_No   = res.НомерЗаказа
        if( mp ) {
          IPAY({api_token: 'YRF3C5RFICWISEWFR6GJ'});
          ipayCheckout({
            amount:         info.Total + info.DelivSum,
            currency:       'RUB',
            order_number:   res.НомерЗаказа,
            description:    'Тестовая оплата'},
            function() { showSuccessfulPurchase() },
            function() { showFailurefulPurchase() })
        }
        Store.dispatch({type: "basket", basket: []})
      } else {
        setDeliv(2)
      }
    }

  
    let elem = <></>

    switch(deliv){

      case 0: elem = <Page1 /> ; break;      
      case 1: elem = <Page2 /> ; break; 
      case 2: elem = <Page3 /> ; break;            

    }


    return <>
      { elem }
      <IonAlert
          isOpen={ choice }
          onDidDismiss={() => setChoice(false)}
          cssClass='my-custom-class'
          header={'Ошибка'}
          message={'К Сожалению оплата по эквайрингу не прошла, повторить попытку ?'}
          buttons={[
            {
              text: 'Нет',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
                setDeliv(2)
              }
            },
            {
              text: 'Да',
              handler: () => {
                IPAY({api_token: 'YRF3C5RFICWISEWFR6GJ'});
                ipayCheckout({
                  amount:         info.Total + info.DelivSum,
                  currency:       'RUB',
                  order_number:   info.Order_No,
                  description:    'Тестовая оплата'},
                  function() { showSuccessfulPurchase() },
                  function() { showFailurefulPurchase() })
              }
            }
          ]}
        />
    </>;
  }
  
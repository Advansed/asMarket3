import { IonAlert, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonInput
  , IonIcon, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonText, IonModal, IonCard, IonToolbar } from "@ionic/react";
import { setErrorHandler } from "ionicons/dist/types/stencil-public-runtime";
import { arrowBackOutline, bicycleOutline, businessOutline, cardOutline, cashOutline, homeOutline, phonePortrait, storefrontOutline } from "ionicons/icons";
import { setUncaughtExceptionCaptureCallback } from "process";
import { useEffect, useState } from "react";
import { AddressSuggestions } from "react-dadata";
import MaskedInput from "../mask/reactTextMask";
import { getData1C, getData, Store } from "../pages/Store";
import './Order.css'
import { IPAY, ipayCheckout } from './sber'
import { v4 as uuidv4 } from 'uuid';

declare type Dictionary = {
    [key: string]: any;
  };

const info = {
  StatusId:         0,
  Order_No:         "",
  Phone:            "",
  Address:          "",
  CustomerName :    "",
  DeliveryMethod:   "Доставка",
  DeliveryTime:     "",
  PaymentMethodId:  "Эквайринг",
  CustomerComment:  "",
  PaymentStatus:    0,
  Total:            0,
  DelivSum:         0,
  promokod:         "",
  promo_percent:    0,
  promo_sum:        0, 
  OrderDetails:     []
}

export function   Order( props ):JSX.Element {
    const [message,   setMessage] = useState("")
    const [mp,        setMP]      = useState(true)
    const [dost,      setDost]    = useState(info.DeliveryMethod === "Доставка")
    const [upd,       setUpd]     = useState(0)
    const [deliv,     setDeliv]   = useState(0)
    const [choice,    setChoice]  = useState(false)
    const [promo,     setPromo]   = useState<any>()
    const [modal,     setModal] = useState(false)


    useEffect(()=>{
        let sum = Store.getState().basket.reduce(function(a, b){ return a + b.Сумма;}, 0)
        info.Phone =           Store.getState().login.code
        info.CustomerName =    Store.getState().login.name
        info.Address =         Store.getState().login.address
        info.Total =           sum

        info.StatusId =        uuidv4()
        
        let del = Store.getState().market.sum;
        let tabs = Store.getState().market.tabs;
        
        for(let i = 0; i < tabs.length; i++){
            console.log(sum.toString() + ' - ' + tabs[i].sum.toString())
            console.log(tabs[i].sum <= sum)
            if(tabs[i].sum <= sum) {
              del = tabs[i].del
              console.log(del)
            }
        }
        console.log(del)
        info.DelivSum =        del;
        info.OrderDetails =    Store.getState().basket.map(e =>{
          return {
              ProductId:  e.Код, 
              Name:       e.Наименование, 
              Weight:     e.Вес, 
              Amount:     e.Количество, 
              Price:      e.Цена, 
              Total:      e.Сумма}
        })
        setUpd(upd + 1)
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
        getData1C("Оплата", info);   
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
                    console.log(info.Phone)
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
                  info.Address = Store.getState().login.address;
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
                defaultQuery = { info.Address }
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
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( info?.DelivSum )
              } </IonLabel>
            </IonItem>
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Сумма товаров </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.Total) } </IonLabel>
            </IonItem>
            <IonItem class={ promo === undefined ? "hidden" : "ml-1"} lines="none">
              <IonCardSubtitle>Промокод </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">
                  { promo?.Промокод }
              </IonLabel>
            </IonItem>
            <IonItem class={ promo === undefined ? "hidden" : "ml-1"} lines="none">
              <IonCardSubtitle>Скидка по промокоду </IonCardSubtitle>
              <IonLabel slot="end" class="a-right"> -
                { 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.promo_sum)
                }
              </IonLabel>
            </IonItem>
            
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Итого </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ 
                  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.Total + info?.DelivSum - info?.promo_sum)
              } </IonLabel>
            </IonItem>
          </IonList>
          <div className="footer-order">
         
          <div className="or-btn">
            <button
              className = { "orange-clr-bg"}
              slot="end"
              onClick={()=>{
                setModal(true)
              }}  
            >
              Промокод
            </button>         
          </div>
         <div className="or-btn">
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
      console.log(res)
      if(res.Код === 100 ) {
        info.Order_No   = res.НомерЗаказа
        if( info.PaymentMethodId === "Эквайринг" ) {
          console.log("equaring")
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
        setDeliv(1)
      } else {
        setDeliv(2)
      }
    }

    function ModalPromo():JSX.Element {
      const [alert1, setAlert1] = useState(false)
      const [alert2, setAlert2] = useState(false)
  
      async function Promokod(Код){
        let res = await getData("method", {
            method: "Промокод",
            code: Код
        })
        console.log(res)
        if(res.length > 0) {
          info.promokod       = res[0].Промокод
          info.promo_sum      = (res[0].Процент * info.Total / 100) > res[0].Сумма ? (res[0].Процент * info.Total / 100) : res[0].Сумма
          if(info.promo_sum > (info.Total + info.DelivSum)) info.promo_sum = info.Total + info.DelivSum
          setModal(false)
          setPromo(res[0])
        } else setAlert2(true)
      }
  
      function getISO(dat) {
        if(dat === undefined) return ""
        let st = dat.substring(0, 10);
        st = st.replace('40', '20').replace('-', '.').replace('-', '.');
        return st
    }
  
      let elem = <>
            <div>
              <h1 className="a-center">Введите промокод</h1>
              <h4 className="a-center"> { "Заказ на сумму " + (info?.Total + info?.DelivSum).toString() + " руб." }</h4>
            </div>
            {/* <div className="r-circle3"><div className="r-circle2"></div></div> */}
            <div className="r-content">
            <div className="lg-promo-box">
  
                  <IonInput
                      className   = "lg-promo-input"
                      type        = "text"
                      inputMode   = "numeric"
                      maxlength   = { 9 }
                      onIonChange = {(e)=>{
                          let val = e.detail.value;
                          if(val?.length === 9) {
                            Promokod(val)                              
                          }
                          
                      }}
                      />
              </div>
              <IonToolbar class="i-content">
                <div className="btn-r">
                      <button
                        slot="end"
                        onClick={()=>{
                            //getSMS(phone)
                            setModal(false)
                        }}  className="orange-clr-bg"
                      >
                        Отменить
                      </button>
                </div>
              </IonToolbar>
              </div>
  
          <IonAlert
            isOpen={ alert1 }
            onDidDismiss={() => setAlert1(false)}
            cssClass='my-custom-class'
            header={'Успех'}
            message={'Промокод активирован'}
            buttons={['Ок']}
          />
          <IonAlert
            isOpen={ alert2 }
            onDidDismiss={() => setAlert2(false)}
            cssClass='my-custom-class'
            header={'Ошибка'}
            message={'Неверный код'}
            buttons={['Ок']}
          />
  
   
      </>
  
      return elem;
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

        <IonModal isOpen = { modal }
          cssClass = "o-modal"
        >
          <ModalPromo />
        </IonModal> 
    </>;
  }
  

import { IonAlert, IonCardSubtitle, IonCol, IonInput
    , IonIcon, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonText, IonModal, IonToolbar, IonRow } from "@ionic/react";
  import { bicycleOutline, businessOutline, cashOutline, homeOutline, storefrontOutline, cardSharp, cashSharp } from "ionicons/icons";
  import { useEffect, useState } from "react";
  import { getData1C, getData, Store } from "../pages/Store";
  import './Order.css'
  import { IPAY, ipayCheckout } from './sber'
  
  

   
export function Payment():JSX.Element {
    const [choice, setChoice]   = useState(false)
    const [modal, setModal]     = useState(false)
    const [promo, setPromo]     = useState<any>()
    const [page, setPage]       = useState(0)

    function        showSuccessfulPurchase(){
        getData1C("Оплата", Store.getState().order);   
    }
  
    function        showFailurefulPurchase(){
      setChoice(true)
    }
    
    async function Order(){
        let info = Store.getState().order;
        let res = await getData1C("Заказ", info);
        console.log(res)
        let phone = localStorage.getItem("marketAs.login")
        if(phone === null || phone === undefined) 
          localStorage.setItem("marketAs.login", info.Phone)
        if(res.Код === 100 ) {
          info.Order_No   = res.НомерЗаказа
          if(info.Total + info.DelivSum - info.promo_sum === 0){
            Store.dispatch({type: "basket", basket: []})
            setPage(1)  
          } 
          else 
          if( info.PaymentMethodId === "Эквайринг" ) {
            console.log("equaring")
            IPAY({api_token: 'jhd5kld3rc36oib1508stfk26f'});
            ipayCheckout({
              amount:         info.Total + info.DelivSum - info.promo_sum,
              currency:       'RUB',
              order_number:   res.НомерЗаказа,
              description:    'Оплата заказа № ' + res.НомерЗаказа },
              function() { showSuccessfulPurchase() },
              function() { showFailurefulPurchase() })
          }
          Store.dispatch({type: "basket", basket: []})
          setPage(1)
        } else {
          setPage(2)
        }
    }
  
    function Page1():JSX.Element {
        const [info, setInfo] = useState(Store.getState().order)
        const [upd, setUpd] = useState(0)
  
        useEffect(()=>{
          setInfo(Store.getState().order)
        }, [])

        Store.subscribe({num: 81, type: "info", func: ()=>{
            setInfo(Store.getState().order)
            console.log("subs")
          }})

          function Payment():JSX.Element {
            const [edit, setEdit] = useState(false)
    
            let elem = <>
              <div className="borders mt-3 ml-1 mr-1">
                <div className={ edit ? "flex fl-space mb-1 mt-1 ml-2 mr-2 bottom fs-12" : "hidden"}>
                <IonSelect value={ info.PaymentMethodId } okText="Да" cancelText="Нет" onIonChange={e => {
                    info.PaymentMethodId = e.detail.value
                    setUpd(upd + 1)
                    setEdit(!edit)

                }}>
                  <IonSelectOption value="Эквайринг">Эквайринг</IonSelectOption>
                  <IonSelectOption value="Наличными курьеру">Наличными курьеру</IonSelectOption>
                  <IonSelectOption value="Картой курьеру">Картой курьеру</IonSelectOption>
                  {/* <IonSelectOption value="посчету">По счету</IonSelectOption> */}
                </IonSelect>
              </div>
                <div className = {!edit ? "flex" : "hidden"}
                  onClick = {()=>{
                    setEdit(!edit)
                  }}
                >
                  <div>
                    <IonIcon icon={ cardSharp } className="w-2 h-2"/>
                  </div>         
                  <div className = "ml-2">
                     <div className="fs-07 mb-1"> Метод оплаты</div>
                     <div>
                        <span>{ info.PaymentMethodId }</span>
                     </div>
                  </div>
                </div>
              </div>
            </>
            return elem
          }
          
          function Change():JSX.Element {
            const [edit, setEdit] = useState(false)
    
            let elem = <>
              <div className="borders mt-3 ml-1 mr-1">
                <div className={ edit ? "flex fl-space mb-1 mt-1 ml-2 mr-2 bottom fs-12" : "hidden"}>
                <IonSelect 
                      value={ info?.Change  } 
                      okText="Да" 
                      cancelText="Нет" 
                      onIonChange={e => {
                        info.Change = e.detail.value
                        setEdit(!edit)
                  }}>
                    <IonSelectOption value="-">без сдачи</IonSelectOption>
                    <IonSelectOption value="500">500 руб</IonSelectOption>
                    <IonSelectOption value="1000">1000 руб</IonSelectOption>
                    <IonSelectOption value="2000">2000 руб</IonSelectOption>
                    <IonSelectOption value="5000">5000 руб</IonSelectOption>
                  </IonSelect>
              </div>
                <div className = {!edit ? "flex" : "hidden"}
                  onClick = {()=>{
                    setEdit(!edit)
                  }}
                >
                  <div>
                    <IonIcon icon={ cashSharp } className="w-2 h-2"/>
                  </div>         
                  <div className = "ml-2">
                     <div className="fs-07 mb-1"> Сдача с суммы </div>
                     <div>
                        <span>{ info.Change }</span>
                     </div>
                  </div>
                </div>
              </div>
            </>
            return elem
          }
          
        let elem = <>
             {/* Оплата */}

            <Payment />

            <div className={ info.PaymentMethodId === "Наличными курьеру" ? "" : "hidden"}>
              <Change/>
            </div>

            <h4 className="ml-1 mr-1 pb-1"><b> Итоги по заказу</b> </h4>   
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
              <IonRow>
            <IonCol size="6">
              <button
                onClick={()=>{
                  setModal(true)
                }}  className="or-orange-clr-bg"
              >
                Промокод
              </button>
            </IonCol>
            <IonCol size="6">        
              <button
                onClick={()=>{
                 Order()
                }}  className="or-orange-clr-bg"
              >
                { info.PaymentMethodId === "Эквайринг" ? "Оплатить" : "Заказать"}
              </button>
            </IonCol>            
          </IonRow>        
     
        </>
  
        return elem
    }
  
    function Page2():JSX.Element {
        const [info, setInfo] = useState<any>(Store.getState().order)
  
        useEffect(()=>{
          setInfo(Store.getState().order)
        }, [])
  
        console.log("page2")
        let elem = <>
        
          <div className="order-image">
                <img src = "assets/okimg.png" alt="Ок" />
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
                <img src = "assets/errorimg.png" alt="Ошибка"/>
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
  
    function ModalPromo():JSX.Element {
        const [alert1, setAlert1] = useState(false)
        const [alert2, setAlert2] = useState(false)

        let info = Store.getState().order
    
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
            Store.dispatch(info)
          } else setAlert2(true)
        }
    
      //   function getISO(dat) {
      //     if(dat === undefined) return ""
      //     let st = dat.substring(0, 10);
      //     st = st.replace('40', '20').replace('-', '.').replace('-', '.');
      //     return st
      // }
    
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
  
    function Main():JSX.Element {
        let elem = <></>
        switch(page) {
            case 0: elem = <Page1 />; break;
            case 1: elem = <Page2 />; break
            case 2: elem = <Page3 />
        }
        return elem
    }
    return <>
        
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
                setPage(2)
              }
            },
            {
              text: 'Да',
              handler: () => {
                let info = Store.getState().order
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
        <Main />
        <IonModal isOpen = { modal }
          cssClass = "o-modal"
        >
          <ModalPromo />
        </IonModal> 

    </>


}


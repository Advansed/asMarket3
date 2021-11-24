import { IonAlert, IonButtons, IonHeader, IonInput, IonMenuButton, IonModal, IonPage, IonSearchbar, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { Basket, BasketIcon, BasketPanel } from '../components/Basket';
import { Action } from '../components/Carusel';
import { GCard } from '../components/GCard';
import { InfoPage1, InfoPage2 } from '../components/Infopage';
import { General } from '../components/Main';
import { Order } from '../components/Order';
import { OHistory, Orders } from '../components/Orders';
import { Options, Profile } from '../components/Profile';
import { Login, SMS } from '../components/Registration';
import './Page.css';
import { getData, getData1C, getOrders, Store } from './Store';

import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';

import { Toast } from "@capacitor/toast";
import { Capacitor } from '@capacitor/core';
import { convertMaskToPlaceholder } from '../mask/src/utilities';

const Page: React.FC = () => {
  const [modal, setModal] = useState(false)
  const [order, setOrder] = useState<any>()
  const { name } = useParams<{ name: string; }>();

  let hust = useHistory();

  const nullEntry: any[] = []

  const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

  useEffect(()=>{
    return ()=>{
      Store.unSubscribe(1)
      Store.unSubscribe(2)
    }
  },[])


  const register = () => {
         
    console.log("register")
    
      console.log('начало регистрации');

      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
          (token: Token) => {
//              setToken(token)
            let auth = Store.getState().auth;
            if( auth ) {
                getData("method", {
                    method:     "Токен",
                    phone:      Store.getState().login.code,
                    token:      token.value,
                })
              showToast(token.value);
            }
              
          }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
          (error: any) => {
              alert('Ошибка регистрации: ' + JSON.stringify(error));
          }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
            //console.log(notification)
            //  setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])
          }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
            //  setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
          }
      );
    
}
  const showToast = async (msg: string) => {
    await Toast.show({
        text: msg
    })
  }

  document.addEventListener('ionBackButton', (ev: any) => {
    ev.detail.register(10, () => {
      hust.goBack();
    });
  });

  Store.subscribe({num: 1, type: "route", func: ()=>{ 
    let route = Store.getState().route;
    switch( route ) {
      case "back": {
          console.log(hust.location.pathname)
          if(hust.location.pathname === "/page1/options"){
            Store.dispatch({type: "route", route: "/page/root"})
          } else 
            hust.goBack(); 
  
        }; break
      case "forward": hust.goForward(); break;
      default: hust.push( route );
    }
  }})

  Store.subscribe({num: 2, type: "auth", func: ()=>{
    if( Store.getState().auth) {
      if (isPushNotificationsAvailable) {

        PushNotifications.checkPermissions().then((res) => {
            if (res.receive !== 'granted') {
              PushNotifications.requestPermissions().then((res) => {
                if (res.receive === 'denied') {
                  showToast('Push Notification permission denied');
                }
                else {
                  showToast('Push Notification permission granted');
                  register();
                }
              });
            }
            else {
              register();
            }
        });
      }

      getOrders();
      
    }

  }})

  Store.subscribe({num: 3, type: "orders", func: ()=>{
    let orders = Store.getState().orders;
    console.log("orders--")

      var ind = orders.findIndex(function(b) { 
          return b.Статус === 0; 
      });
      if(ind >= 0){
        if( !modal ){
          setOrder(orders[ind])
          getSMS()
        }
      }
      
  }})

  async function getSMS(){
      let res = await getData1C("ПолучитьСМС", {
          Телефон: Store.getState().login.code
      })
      if(res !== undefined){
        console.log("Подтверждение")
        if(res.СМС !== undefined) {
          Store.dispatch({ type: "login", SMS: res.СМС })
          setModal( true );
      }
      }
  }

  function Main(props):JSX.Element {
    let elem = <></>

    if(name.substr(0, 1) === "_"){
      elem = <>
        <div className="ml-05 mr-05">
          <GCard info = { name.substr(1) }/>
        </div>
      </>
    } else    switch (props.name) {
      case "root" :         elem = <General />; break;
      case "action":        elem = <Action />; break
      default :             elem = <></> 
    }

    return elem;
  }

  function ModalSMS():JSX.Element {
    const [tires, setTires] = useState("----")
    const [alert1, setAlert1] = useState(false)
    const [alert2, setAlert2] = useState(false)

    function getISO(dat) {
      if(dat === undefined) return ""
      let st = dat.substring(0, 10);
      st = st.replace('40', '20').replace('-', '.').replace('-', '.');
      return st
  }

    let elem = <>
          <div>
            <h1 className="a-center">Подтвердите заказ</h1>
            <h4 className="a-center"> { "Заказ " + order?.Номер + " от " + getISO(order?.Дата) }</h4>
            <h4 className="a-center"> { order?.Адрес }</h4>
            <h4 className="a-center"> { "Сумма " + order?.СуммаДокумента + " руб" }</h4>
          </div>
          {/* <div className="r-circle3"><div className="r-circle2"></div></div> */}
          <div className="r-content">
          <div className="lg-sms-box">
                <div className="lg-div-1">
                    <span></span>
                    { tires }
                </div>

                <IonInput
                    className   = "lg-sms-input"
                    type        = "text"
                    inputMode   = "numeric"
                    maxlength   = { 4 }
                    onIonChange = {(e)=>{
                        let val = e.detail.value;
                        switch (val?.length) {
                            case 0:     setTires("----");break;       
                            case 1:     setTires("---");break;       
                            case 2:     setTires("--");break;       
                            case 3:     setTires("-");break;       
                            case 4:     setTires("");break;       
                            default:    setTires("----");break;       
                        }
                        if(val?.length === 4) {
                            let SMS = Store.getState().login.SMS
                            console.log(Store.getState().login)
                            if(SMS === val) {
                                getData("method",{ method: "ПодтвердитьЗаказ", docNum: order?.Номер })
                                setAlert1(true)    
                                setModal(false)
                            } else {
                                setAlert2(true)
                            }
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
                          console.log("Отменить")
                          getData1C("ОтменитьЗаказ", { Номер: order?.Номер })
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
          message={'Заказ подтвержден'}
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

  return (
    <IonPage>      
      <IonHeader >
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonSearchbar 
            debounce = { 1000 }
            onIonChange = {(e) => {
              Store.dispatch({type: "search", search: e.detail.value  as string});
            }}
          />
        </IonToolbar>
      </IonHeader>
      <Main name = { name }/>
      <BasketPanel />
      <IonModal isOpen = { modal }>
        <ModalSMS />
      </IonModal>
    </IonPage>
  );
};

export default Page;

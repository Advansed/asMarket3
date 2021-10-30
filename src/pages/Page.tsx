import { IonButtons, IonHeader, IonMenuButton, IonPage, IonSearchbar, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { Action1 } from '../components/Actions';
import { Basket, BasketIcon } from '../components/Basket';
import { Action } from '../components/Carusel';
import { GCard } from '../components/GCard';
import { InfoPage1, InfoPage2 } from '../components/Infopage';
import { General } from '../components/Main';
import { Order } from '../components/Order';
import { OHistory, Orders } from '../components/Orders';
import { Options, Profile } from '../components/Profile';
import { Login, SMS } from '../components/Registration';
import './Page.css';
import { setToken, Store } from './Store';

import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';

import { Toast } from "@capacitor/toast";
import { Capacitor } from '@capacitor/core';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  let hust = useHistory();

  const nullEntry: any[] = []
  const [notifications, setnotifications] = useState(nullEntry);

  const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

  useEffect(()=>{
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
  },[])


  const register = () => {
         
    console.log("register")
    
      console.log('начало регистрации');

      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
          (token: Token) => {
              setToken(token)
              showToast('Успешно зарегистрован');
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
              setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])
          }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
              setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
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
        if(hust.location.pathname === "/page/options"){
          Store.dispatch({type: "route", route: "/page/root"})
        } else 
          hust.goBack(); 

      }; break
    case "forward": hust.goForward(); break;
    default: hust.push( route );
  }
  }})

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
      case "basket" :       elem = <Basket />; break;
      case "order" :        elem = <Order />; break;
      case "login":         elem = <Login />; break
      case "SMS":           elem = <SMS />; break
      case "options":       elem = <Options />; break
      case "profile":       elem = <Profile />; break
      case "orders":        elem = <Orders />; break
      case "contacts":      elem = <InfoPage1 />; break
      case "info":          elem = <InfoPage2 />; break
      case "action":        elem = <Action />; break
      case "login":         elem = <Login />; break
      case "orders":        elem = <Orders />; break
      case "history":       elem = <OHistory />; break
      default :             elem = <></> 
    }

    return elem;
  }

  return (
    <IonPage>      
      <IonHeader >
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonSearchbar />
          <div slot="end">
            <BasketIcon />
          </div>
        </IonToolbar>
      </IonHeader>
      <Main name = { name }/>
    </IonPage>
  );
};

export default Page;

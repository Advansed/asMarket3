import { IonPage } from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import { Action1 } from '../components/Actions';
import { Basket } from '../components/Basket';
import { Action } from '../components/Carusel';
import { GCard } from '../components/GCard';
import { InfoPage1, InfoPage2 } from '../components/Infopage';
import { General } from '../components/Main';
import { Order } from '../components/Order';
import { OHistory, Orders } from '../components/Orders';
import { Options, Profile } from '../components/Profile';
import { Login, SMS } from '../components/Registration';
import './Page.css';
import { Store } from './Store';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  let hust = useHistory();

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
      case "action":        elem = <Action1 />; break
      case "actionpage":    elem = <General info = { "01-00000100"} />; break
      case "login":         elem = <Login />; break
      case "orders":        elem = <Orders />; break
      case "history":       elem = <OHistory />; break
      default :             elem = <></> 
    }

    return elem;
  }

  return (
    <IonPage>
      <Main name = { name }/>
    </IonPage>
  );
};

export default Page;

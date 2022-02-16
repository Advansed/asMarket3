import { IonButtons, IonHeader, IonIcon, IonPage, IonToolbar } from '@ionic/react';
import { chevronBackSharp } from 'ionicons/icons';
import { useParams } from 'react-router';
import { Basket } from '../components/Basket';
import { GCard } from '../components/GCard';
import { InfoPage1, InfoPage2, InfoPage3 } from '../components/Infopage';
import { Order } from '../components/Order';
import { OHistory, Orders } from '../components/Orders';
import { Payment } from '../components/Payment';
import { Options, Profile } from '../components/Profile';
import { Login, SMS } from '../components/Registration';
import './Page.css';
import { Store } from './Store';

const Page1: React.FC = () => {
  
  const { name } = useParams<{ name: string; }>();



  function Main(props):JSX.Element {
    let elem = <></>

    if(name.substr(0, 1) === "_"){
      elem = <>
        <div className="ml-05 mr-05 h-100">
          <GCard info = { name.substr(1) }/>
        </div>
      </>
    } else    
    switch (props.name) {
      case "basket":        elem = <Basket />;  break;
      case "SMS":           elem = <SMS />; break
      case "order" :        elem = <Order />;   break;
      case "options":       elem = <Options />; break
      case "profile":       elem = <Profile />; break
      case "login":         elem = <Login />; break
      case "orders":        elem = <Orders />; break
      case "payment":       elem = <Payment />; break
      case "history":       elem = <OHistory />; break
      case "contacts":      elem = <InfoPage1 />; break
      case "info":          elem = <InfoPage2 />; break
      case "policy":        elem = <InfoPage3 />; break
      default :             elem = <></> 
    }

    return elem;
  }

  return (
    <IonPage>
      <IonHeader >
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon icon={  chevronBackSharp } className="ml-1 w-1 h-1" 
              onClick = {() =>{
                Store.dispatch({type: "route", route: "back"})
              }}
            />
          </IonButtons>
          <h4 className="ml-1"> {
            name === "order" 
              ? "Оформление заказа" 
              : name === "payment"
              ? "Оплата заказа"
              : name === "basket"
              ? "Корзина"
              : name === "options"
              ? "Личный кабинет"
              : name === "profile"
              ? "Профиль"
              : name === "orders"
              ? "Мои заказы"
              : name === "history"
              ? "История"
              : name === "info"
              ? "Условия работы"
              : name === "policy"
              ? ""
              : name === "contacts"
              ? "О нас"
              : ""
          }</h4>
        </IonToolbar>
      </IonHeader>

      <Main name = { name }/>
    </IonPage>
  );
};

export default Page1;

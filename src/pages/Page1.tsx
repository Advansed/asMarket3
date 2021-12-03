import { IonButtons, IonHeader, IonIcon, IonPage, IonToolbar } from '@ionic/react';
import { arrowBackOutline, backspaceOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router';
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
        <div className="ml-05 mr-05">
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
            <IonIcon icon={  arrowBackOutline } className="ml-05 w-2 h-2" 
              onClick = {() =>{
                Store.dispatch({type: "route", route: "back"})
              }}
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <Main name = { name }/>
    </IonPage>
  );
};

export default Page1;

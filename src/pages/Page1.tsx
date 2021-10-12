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

export default Page1;

import { IonPage } from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import { Basket } from '../components/Basket';
import { GCard } from '../components/GCard';
import { Order } from '../components/Order';
import './Page.css';

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
      case "basket":        elem = <Basket />; break;
      case "order" :        elem = <Order />; break;
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

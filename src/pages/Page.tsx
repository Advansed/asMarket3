import { IonPage } from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import { General } from '../components/Main';
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

    switch (props.name) {
      case "root" : elem = <General />; break;
      default : elem = <></> 
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

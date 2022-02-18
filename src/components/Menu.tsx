import {
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonRow,
  
} from '@ionic/react';

import { archiveSharp, bookmarkOutline, bookmarksOutline, checkboxOutline, cloudDownloadOutline, cloudDownloadSharp, happyOutline
    , heartSharp, homeOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, personOutline, trashSharp } from 'ionicons/icons';
import './Menu.css';
import { download, Store } from '../pages/Store';
import { useState } from 'react';
import localforage from 'localforage';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Категории',
    url: '/page/root',
    iosIcon: homeOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Заказы',
    url: '/page1/orders',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'История заказов',
    url: '/page1/history',
    iosIcon: bookmarksOutline,
    mdIcon: heartSharp
  },
  {
    title: 'Условия работы',
    url: '/page1/info',
    iosIcon: checkboxOutline,
    mdIcon: trashSharp
  },
  {
    title: 'Политика конфиденциальности',
    url: '/page1/policy',
    iosIcon: checkboxOutline,
    mdIcon: trashSharp
  },
  {
    title: 'О нас',
    url: '/page1/contacts',
    iosIcon: happyOutline,
    mdIcon: archiveSharp
  },
  {
    title: 'Обновить данные',
    url: '',
    iosIcon: cloudDownloadOutline,
    mdIcon: cloudDownloadSharp
  },
 
];

const labels = ['Акции', 'Скидки', 'Бренды'];

const Menu: React.FC = () => {
  const [upd, setUpd] = useState(0);

  Store.subscribe({num: 81, type: "auth", func: ()=>{
    setUpd( upd + 1);
  }})
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>
          <IonMenuToggle autoHide={false}>
            
              <IonRow>
              <IonImg  src = "assets/asMarket.jpg" class="m-img" />
              <div className="m-header">
                    <p>Добро</p>
                    <p>пожаловать!</p>
                  </div>
              </IonRow>
              <hr></hr>
              <IonRow>
                  
                  <div>
                    <IonIcon icon={personOutline} className="m-mr"></IonIcon>
                    <button
                     className="m-btn m-sizetext"
                      onClick = {()=>{
                        if(Store.getState().auth)
                          Store.dispatch({type: "route", route: "/page1/options"})
                        else
                          Store.dispatch({type: "route", route: "/page1/login"})
                      }}
                    > 
                    { Store.getState().auth ? "Профиль" : "Вход" }
                     </button>
                  </div>
                  </IonRow>
            
            </IonMenuToggle>
          </IonListHeader>
          
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerLink={appPage.url} routerDirection="none" lines="none" detail={false} 
                  onClick = {()=>{
                    
                    if(appPage.title === "Акции"){
                      Store.dispatch({type: "category", category: "01-00000100"})
                      console.log("menu")
                    }
                    if(appPage.title === "Обновить данные"){
                      console.log("download")
                      localStorage.setItem("asmrkt.timestamp",  "2022-01-01");
                      localforage.clear();
                      Store.dispatch({type: "load", load: "2022-01-01"})
                       download( );                    }
                  }} 
                >
                  <IonIcon  className="m-mr2" ios={appPage.iosIcon}  />
                  <IonLabel className=" m-sizetext">{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Возможности</IonListHeader>
          <IonMenuToggle autoHide={false}>
            {labels.map((label, index) => (
                <IonItem lines="none" key={index}
                  onClick = {()=>{
      
                    if(label === "Акции"){
                      Store.dispatch({type: "category", category: "01-00000100"})
                      console.log("menu")
                    }                
                  }}
                >
                  <IonIcon slot="start" icon={bookmarkOutline} />
                  <IonLabel>{label}</IonLabel>
                </IonItem>
              ))}
          </IonMenuToggle>
        </IonList>
        
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

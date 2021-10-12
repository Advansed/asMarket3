import {
  IonButton,
  IonCol,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRow,
  
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, bookmarksOutline, checkboxOutline, contractOutline, happyOutline, heartOutline, heartSharp, homeOutline, logInOutline, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, personCircleOutline, personOutline, personSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import { Store } from '../pages/Store';

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
    title: 'Акции',
    url: '',
    iosIcon: heartOutline,
    mdIcon: archiveSharp
  },
  {
    title: 'Заказы',
    url: '/page/orders',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'История заказов',
    url: '/page/history',
    iosIcon: bookmarksOutline,
    mdIcon: heartSharp
  },
  {
    title: 'Условия работы',
    url: '/page/info',
    iosIcon: checkboxOutline,
    mdIcon: trashSharp
  },
  {
    title: 'О нас',
    url: '/page/contacts',
    iosIcon: happyOutline,
    mdIcon: archiveSharp
  },
 
];



const Menu: React.FC = () => {
  const location = useLocation();

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
                          Store.dispatch({type: "route", route: "/page/options"})
                        else
                          Store.dispatch({type: "route", route: "/page/login"})
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
                      console.log(appPage.title)
                    }
                  }} 
                >
                  <IonIcon  className="m-mr2" ios={appPage.iosIcon}  />
                  <IonLabel className=" m-sizetext">{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

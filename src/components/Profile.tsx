import { useEffect, useState } from "react";
import { download, getData, Store } from "../pages/Store";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonAvatar, IonButton, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonItem
    , IonList, IonLoading, IonRow, IonText, IonThumbnail } from "@ionic/react";
import { arrowBackOutline, bagHandleOutline, cameraOutline, cloudDownloadOutline, exitOutline, headsetOutline, informationCircleOutline, mailUnreadOutline
  , personCircleOutline, shieldCheckmarkOutline } from "ionicons/icons";
import './Profile.css'
import localforage from "localforage";

defineCustomElements(window)

async function    takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    // source: CameraSource.Photos
    });
    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    
    return imageUrl
    // Can be set to the src of an image no
  
  }

  
export function   Profile():JSX.Element {
    const [load , setLoading] = useState(false)
    const [ login, setLogin ] = useState (Store.getState().login);

    Store.subscribe({num: 51, type: "login", func: ()=>{
      setLogin(Store.getState().login)
    }})

    useEffect(()=>{
      setLogin(Store.getState().login)
      console.log(Store.getState().login)
    }, [])
  
    async function saveProfile(){
      setLoading(true)
  
      login.method = "СохранитьПрофиль"
      getData("method", login)
  
      setLoading(false)
  
    }
  
    async function getFoto(){
      const imageUrl = await takePicture();
      login.Картинка = imageUrl
      setLogin(login)
      Store.dispatch({type: "login", Картинка: imageUrl})
  
    }
  
    let elem = <>
      
        <IonLoading isOpen = { load } message = "Подождите" />
        <IonCardContent>
          <div className="pr-container">
            <div className="p-card">
                <img src = { login.image } alt="" />
                <div className="btn-add-photo">
                    <IonButton className="pr-btn" fill="clear"
                      onClick = {()=>{
                        getFoto()    
                      }}
                    >
                      <IonIcon slot = "icon-only" icon={ cameraOutline }/>
                    </IonButton>
                    
                </div>
            </div>
            
            <IonList class="ml-1 mr-2">
              <IonItem>
                <IonInput
                  placeholder = "ФИО, псевдоним"
                  onIonChange={(e)=>{
                    Store.dispatch({type: "login", name: e.detail.value as string})
                    login.name = e.detail.value as string
                  }}
                  value = { login.name }
                />
              </IonItem>
              <IonItem>
                <IonInput
                  placeholder = "Эл. почта"
                  onIonChange={(e)=>{
                    Store.dispatch({type: "login", email: e.detail.value as string})
                    login.email = e.detail.value as string
                  }}          
                  value = { login.email }
                />
              </IonItem>
              <IonItem>
                <IonInput
                  placeholder = "Адрес"
                  onIonChange={(e)=>{
                    Store.dispatch({type: "login", address: e.detail.value as string})
                    login.address = e.detail.value as string
                  }}          
                  value = { login.address }
                />
              </IonItem>
            </IonList>
            <IonRow>
            <div className="btn-r">
                  <button
                    slot="end"
                    onClick={()=>{
                      saveProfile()
                      Store.dispatch({type: "route", route: "/page/root"})
                    }}  className="orange-clr-bg"
                  >
                    Сохранить
                  </button>
            </div>
            <div className="btn-r">
                  <button
                    slot="end"
                    onClick={()=>{
                      Store.dispatch({type: "route", route: "/page/orders"})
                    }}  className="orange-clr-bg"
                  >
                    Мои заказы
                  </button>
            </div>
            <div className="btn-r">
                  <button
                    slot="end"
                    onClick={()=>{
                      saveProfile()
                      Store.dispatch({type: "route", route: "/page/root"})
                    }}  className="orange-clr-bg"
                  >
                    Выход
                  </button>
            </div>
            

            </IonRow>
          </div>
        </IonCardContent>
       
    </>
  
    return elem;
}
  
export function   Options():JSX.Element {
  
  function          Person():JSX.Element{
      const [ login ] = useState( Store.getState().login )

      let elem = <>
        
          <IonCardContent>
            <IonItem class=" mb-1" detail lines="full"
              onClick = {()=>{
                Store.dispatch({type: "route", route: "/page1/profile"})
              }}
            >
              <IonItem lines="none">
                <IonAvatar slot="start">
                  <img src={ login.image === "" ? personCircleOutline : login.image } 
                  alt=""
                />
                </IonAvatar>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput placeholder="ФИО, псевдоним" disabled
                        value = { login.name }  
                      >
                      </IonInput> 
                    </IonCol>           
                  </IonRow>
                  <IonRow>
                    <IonCol>
                    <IonInput placeholder="Телефон" disabled
                      value = { login.code }  
                    >
                    </IonInput>
                    </IonCol>           
                  </IonRow>
                </IonGrid> 
              </IonItem>
            </IonItem>
            <IonItem class="mt-1 mb-1 op-item" lines = "none" detail
              onClick={()=>{
                Store.dispatch({type: "route", route: "/page1/orders"})
              }}
            >
                <IonThumbnail class="op-thumb" color="blue" slot="start">
                  <IonIcon class= "op-icon" icon = { bagHandleOutline }/>
                </IonThumbnail>
                <IonText> Мои заказы </IonText>
            </IonItem>
            <IonItem class="mt-1 mb-1 op-item" lines = "none" detail
              onClick={()=>{
                //Store.dispatch({type: "route", route: "/menu/notifs"})
              }}
            >
                <IonThumbnail class="op-thumb1" color="blue" slot="start">
                  <IonIcon class= "op-icon" icon = { mailUnreadOutline }/>
                </IonThumbnail>
                <IonText> Уведомления </IonText>
            </IonItem>
            <IonItem class="mt-1 mb-1 op-item" lines = "none" detail
              onClick={()=>{
                Store.dispatch({type: "route", route: "/page1/info"})
              }}
            >
                <IonThumbnail class="op-thumb2" color="blue" slot="start">
                  <IonIcon class= "op-icon" icon = { shieldCheckmarkOutline }/>
                </IonThumbnail>
                <IonText> Ответы на вопросы </IonText>
            </IonItem>
            <IonItem class="mt-1 mb-1 op-item" lines = "none" detail
               onClick={()=>{
                Store.dispatch({type: "route", route: "/page1/contacts"})
              }}             
            >
                <IonThumbnail class="op-thumb3" color="blue" slot="start">
                  <IonIcon class= "op-icon" icon = { headsetOutline }/>
                </IonThumbnail>
                <IonText> Контакты </IonText>
            </IonItem>
            <IonItem class="mt-1 mb-1 op-item" lines = "none" detail
               onClick={()=>{
                Store.dispatch({type: "route", route: "/page1/about"})
              }}             
            >
                <IonThumbnail class="op-thumb" color="blue" slot="start">
                  <IonIcon class= "op-icon" icon = { informationCircleOutline }/>
                </IonThumbnail>
                <IonText> О приложении </IonText>
            </IonItem>
            <IonItem class="mt-1 mb-1 op-item" lines = "none" detail
               onClick={()=>{
               // Plugins.App.exitApp();
                Store.dispatch({type: "auth",   auth: false})
                Store.dispatch({type: "orders", orders: []})
                Store.dispatch({  
                  type:              "login",
                  code:                   "",
                  name:                   "",
                  email:                  "",
                  password:               "",
                  address:                "",
              })
                Store.dispatch({type: "route",  route: "back"})
              }}             
            >
                <IonThumbnail class="op-thumb1" color="blue" slot="start">
                  <IonIcon class= "op-icon" icon = { exitOutline }/>
                </IonThumbnail>
                <IonText> Выйти </IonText>
            </IonItem>
          </IonCardContent>
        
    </>;
    return elem
}
  
  let elem = <>
      <Person />
  </>

  return elem;
}

function Download():JSX.Element {
  const [load, setLoad] = useState(false)
  
  Store.subscribe({num: 15, type: "load", func: ()=>{
    setLoad(Store.getState().load !== "")
    console.log("subscr download")
  }})

  useEffect(()=>{
    console.log("effect download")
    setLoad(Store.getState().load !== "")
  }, [])

  let elem = <>
    <IonLoading isOpen = { load } message = "loading"/>
    <IonIcon class= "op-icon" icon = { cloudDownloadOutline } />
  </>

  return elem
}
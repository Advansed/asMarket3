import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonChip, IonCol, IonIcon, IonItem, IonLabel, IonRow, IonText, IonToolbar } from "@ionic/react";
import { addOutline, arrowBackOutline, checkmarkCircleOutline, removeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Store } from "../pages/Store";
import { addBasket } from "./Basket";
import './GCard.css'

export function   GCard(props):JSX.Element {
  
  const [good,    setGood]  = useState<any>({})
  const [upd,     setUpd]   = useState(0)
  const [info,    setInfo]  = useState<any> ({
        Код:            good.Код,
        Наименование:   good.Наименование,
        Цена:           good.Цена,
        Количество:     1,
        Сумма:          good.Цена,
        Картинка:       good.Картинка
  });
 

  useEffect(()=>{
      let basket  = Store.getState().basket;
      
      let amount  = 0;
      basket.forEach(elem => {
        if(elem.Код === props.info){
          amount = elem.Количество
        }
      });

      let gcard = Store.getState().gcard
      if(gcard === "") 
        Store.dispatch({type: "route", route: "/page/root"})
      else {
        setGood( gcard )
        setInfo({
            Код:                    gcard.Код,
            Наименование:           gcard.Наименование,
            Цена:                   gcard.Цена,
            Количество:             amount,
            Сумма:                  amount * gcard.Цена,
            Картинка:               gcard.Картинка
        })  
      }
  },[])

  function Количество(){
    return info.Количество 
  }

  let elem = <>
            <div className="gc-card"></div>
              <div className="ml-025 ">
              <IonButton color="light"
                onClick = {()=>{
                  Store.dispatch({ type: "route", route: "back" })
                }}
              >
                <IonIcon icon = { arrowBackOutline } />
              </IonButton>
              </div>
              <div className="f-card">
                <img className="" src={  good.Картинка } alt="" />
                </div>
              
            
            <div className="f-content">
            <IonRow>
              <IonCardHeader>
                <h4 className="a-center f-18"><b>{ good.Наименование }</b></h4>
              </IonCardHeader>
              </IonRow>
              <IonRow>
              <IonCol size="5">
              <IonCardTitle class="f-18">
                  <div className="mb-1 ml-1">
                    <div>
                      <IonText class="f-price a-center"><b>{ good.Цена?.toFixed(2) + " ₽ " } </b></IonText>
                    </div>
                  </div>
                  <div className="mb-1 ml-05 mt-3">
                <IonChip color="success" outline>
                  <IonIcon icon = { checkmarkCircleOutline }/>
                  <IonText class="f-12"> { good.Количество > 0 ? ("В Наличии " + good.Количество.toString()) : "Нет в наличии" } </IonText>
                </IonChip>
                </div>
              </IonCardTitle>
              </IonCol>
              
              <IonCol size="7">
              <div className="ml-2 mt-2 mr-1">
                <IonRow>
                <IonCol size="3">
                <IonChip outline color="gc-btn" className="gc-btn"
                    onClick = {()=>{
                      info.Количество = info.Количество - 1 
                      if(info.Количество  < 0) info.Количество = 0
                      info.Сумма = info.Количество * info.Цена;
                      setInfo(info);setUpd(upd + 1);
                      addBasket(good, -1)
                    }}  >
                 -
                </IonChip>
                 
              
            </IonCol>
            <IonCol size="6">
            <div className="w-100">
              <div className="gc-div-1 f-16">
                { Количество()?.toString() + " шт" } 
              </div>      
              <div className="gc-div-2 f-16">
                { (info.Цена * Количество())?.toString() + " руб" } 
              </div>
            </div>
            </IonCol>
            <IonCol size="3">
            <IonChip outline color="gc-btn" className="gc-btn"
                    onClick = {()=>{
                      info.Количество = info.Количество + 1 
                      if(info.Количество > good.Количество) info.Количество = good.Количество
                      info.Сумма = info.Количество * info.Цена;
                      setInfo(info);setUpd(upd + 1);
                      addBasket(good, 1)
                    }}  >
                 +
                </IonChip>
            
            
            </IonCol>
            </IonRow>
            </div>
            </IonCol>
            
              </IonRow>

          <IonRow>
            <IonCardHeader ><b>Описание</b></IonCardHeader>
            <IonText class="gc-text-2">
              { good.Описание }
            </IonText>
            </IonRow>
            <IonRow>
            <IonCardHeader ><b>Производитель</b></IonCardHeader>
            <IonText class="gc-text-2">
              { good.Производитель }
            </IonText>
            </IonRow>
          
          
              
          
          </div>
    </>
    
    
    return elem
}
  
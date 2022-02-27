import { IonCardHeader, IonCardTitle, IonChip, IonCol, IonIcon, IonRow, IonText } from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { getData, Store } from "../pages/Store";
import { BasketPanel1 } from '../components/Basket';
import { addBasket } from "./Basket";
import './GCard.css'

export function   GCard(props):JSX.Element {
  const [img,     setImg]   = useState("");
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
 
  async function load( code ){

    let res = await getData("method", {
      method:         "ПолучитьКартинку",
      code:           code,
    })
    console.log(res)
    if(res.length > 0) {
      setImg(res[0].Картинка)

    }
  }

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
        load( gcard.Код );
        setInfo({
            Код:                    gcard.Код,
            Наименование:           gcard.Наименование,
            Цена:                   gcard.Цена,
            Количество:             amount,
            Сумма:                  amount * gcard.Цена,
            Картинка:               gcard.Картинка
        })  
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function Количество(){
    return info.Количество 
  }

  let elem = <>
    <div className="gc-content">
      <div className="f-card mt-3">
        <img className="" src={  img } alt="" />
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

          <div>
            <IonCardHeader ><b>Описание</b></IonCardHeader>
            <IonText class="gc-text-2">
              { good.Описание }
            </IonText>
          </div>
          <div>
            <IonCardHeader ><b>Производитель</b></IonCardHeader>
            <IonText class="gc-text-2">
              { good.Производитель }
            </IonText>
          </div>
          
          
              
          
          </div>
      <div className="g-ediv">
        <IonText class="a-right">  
          All rights reserved asMarket
        </IonText>
      </div>
      <div className="h-2"></div>

      <BasketPanel1 />
    </div>                
  </>
    
    
    return elem
}
  
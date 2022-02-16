import { IonContent, IonProgressBar } from "@ionic/react"
import { useState } from "react"
import { Store } from "../pages/Store"
import { Carusel } from "./Carusel"
import { Categories } from "./Categories"
import { Goods } from "./Goods"
import "./Main.css"

export function General(props):JSX.Element {
    return <>

      <IonContent>
        <Carusel />
        <div className="mr-05 ml-05">
          <Categories info = { props.info } />
          <Goods />
        </div>
      </IonContent>

    </>
}

export function LoadPage():JSX.Element {
  const [info, setInfo] = useState<any>([])

  Store.subscribe({num: 2001, type: "logs", func: ()=>{
    setInfo(Store.getState().logs);
  }})

  let elem = <>
    <div className = "load-div ml-1 mr-1">
      <img src = "assets/asMarket.jpg" alt = "Логотип" />
      <div>
        <h4>
          Подождите
        </h4>
      </div>
      <div>
        <IonProgressBar type="indeterminate"/>
        <span>идет начальная загрузка данных</span>
        <IonProgressBar type="indeterminate" reversed />
      </div>
    </div>
  </>
  return elem
}
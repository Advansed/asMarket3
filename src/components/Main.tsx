import { IonButtons, IonContent, IonHeader, IonMenuButton, IonSearchbar, IonToolbar } from "@ionic/react"
import { useEffect, useState } from "react"
import { BasketIcon } from "./Basket"
import { Carusel } from "./Carusel"
import { Categories } from "./Categories"
import { Goods } from "./Goods"

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
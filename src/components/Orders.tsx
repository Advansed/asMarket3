import { IonCard, IonCardContent, IonCardHeader, IonCol, IonIcon, IonLoading, IonRow,IonText } from "@ionic/react"
import { useEffect, useState } from "react"
import { getData, Store } from "../pages/Store"
import QRCode from "react-qr-code";
import { arrowBackOutline } from "ionicons/icons";

export function Orders(props):JSX.Element{
    const [info, setInfo] = useState<any>([])
    const [load, setLoad] = useState(false)

    async function getOrders(){
        setLoad(true);
        let login = Store.getState().login;
        let res = await  getData("method", {
            method: "Заказы",
            phone: login.code,
        })

        setInfo(res);

        setLoad(false);
    }

    useEffect(()=>{
        getOrders()
    }, [])
    let elem = <></>

    for(let i = 0;i < info.length;i++){
        elem = <>
            { elem }
            
            <IonCard class="о-card">
                <IonCardHeader>
                <IonRow>
                    <IonCol size="8"> <b>{ info[i].Номер }</b> { info[i].Дата } </IonCol>
                    <IonCol size="4" class="a-right">
                    <b>{ info[i].Статус}</b>
                    </IonCol>
                </IonRow>
                </IonCardHeader>
                <IonCardContent>
                <IonRow>
                    <IonCol size="4">
                    {/* <img src = { info[i].Картинка === "" ? imageSharp : info[i].Картинка}  alt = ""/>   */}
                    
                    <QRCode value= { info[i].Номер + ";" + info[i].Дата + ";" } size={ 100 }/>
                    </IonCol>
                    <IonCol size="8">
                    <IonRow>
                        <IonCol>{ info[i].МетодДоставки }</IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>{ info[i].Доставка } <b>{ info[i].СуммаДокумента } руб</b></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>{ info[i].Адрес }</IonCol>
                    </IonRow>
                    </IonCol>
                </IonRow>
                </IonCardContent>
            </IonCard>
        </>
    }
    return <>
    <IonLoading isOpen = { load } message = "Подождите..." />
    <div>
        <IonRow>
            <IonCol size="3">
                <IonIcon icon = { arrowBackOutline } 
                    class= "back ml-1 mt-1 pr-btn2"
                    onClick = {()=>{
                    Store.dispatch({type: "route", route: "back"})
                    }}
                /> 
            </IonCol>
            <IonCol size="7">
                <div className="pr-header">
                    <IonText><h3><b>Мои заказы</b></h3></IonText>
                    </div>
            </IonCol>
            </IonRow> 
        <div>
            { elem }
        </div>
    </div>
    </>
}

export function OHistory(props):JSX.Element{
    const [info, setInfo] = useState<any>([])
    const [load, setLoad] = useState(false)

    async function getOrders(){
        setLoad(true);
        let login = Store.getState().login;
        let res = await  getData("method", {
            method: "Заказы",
            phone: login.code,
        })

        setInfo(res);

        setLoad(false);
    }

    useEffect(()=>{
        getOrders()
    }, [])
    let elem = <></>

    for(let i = 0;i < info.length;i++){
        elem = <>
            { elem }
            
            <IonCard class="о-card">
                <IonCardHeader>
                <IonRow>
                    <IonCol size="8"> <b>{ info[i].Номер }</b> { info[i].Дата } </IonCol>
                    <IonCol size="4" class="a-right">
                    <b>{ info[i].Статус}</b>
                    </IonCol>
                </IonRow>
                </IonCardHeader>
                <IonCardContent>
                <IonRow>
                    <IonCol size="4">
                    {/* <img src = { info[i].Картинка === "" ? imageSharp : info[i].Картинка}  alt = ""/>   */}
                    
                    <QRCode value= { info[i].Номер + ";" + info[i].Дата + ";" } size={ 100 }/>
                    </IonCol>
                    <IonCol size="8">
                    <IonRow>
                        <IonCol>{ info[i].МетодДоставки }</IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>{ info[i].Доставка } <b>{ info[i].СуммаДокумента } руб</b></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>{ info[i].Адрес }</IonCol>
                    </IonRow>
                    </IonCol>
                </IonRow>
                </IonCardContent>
            </IonCard>
        </>
    }
    return <>
    <IonLoading isOpen = { load } message = "Подождите..." />
    <div>
        <IonRow>
            <IonCol size="3">
                <IonIcon icon = { arrowBackOutline } 
                    class= "back ml-1 mt-1 pr-btn2"
                    onClick = {()=>{
                    Store.dispatch({type: "route", route: "back"})
                    }}
                /> 
            </IonCol>
            <IonCol size="7">
                <div className="pr-header">
                    <IonText><h3><b>Мои заказы</b></h3></IonText>
                    </div>
            </IonCol>
            </IonRow> 
        <div>
            { elem }
        </div>
    </div>
    </>
}


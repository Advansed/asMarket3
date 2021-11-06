import { IonCard, IonCardContent, IonCardHeader, IonCol, IonIcon, IonLoading, IonRow,IonText } from "@ionic/react"
import { useEffect, useState } from "react"
import { getData, Store } from "../pages/Store"
import QRCode from "react-qr-code";
import { arrowBackOutline, bicycleOutline, giftOutline, readerOutline, syncCircleOutline } from "ionicons/icons";
import './Orders.css'

export function Orders(props):JSX.Element{
    const [info, setInfo] = useState<any>([])
    const [load, setLoad] = useState(false)


    let elem = <></>

    async function getOrders(){
        setLoad(true);
        let login = Store.getState().login;
        let res = await  getData("method", {
            method: "Заказы",
            phone: login.code,
        })

        console.log(login);
        setInfo(res);
        console.log(res);
        setLoad(false);
    }

    Store.subscribe({num: 71, type: "orders", func: ()=>{
        setInfo(Store.getState().orders);    
    }})

    useEffect(()=>{
        //getOrders()
        setInfo(Store.getState().orders);
        return Store.unSubscribe(71)
    }, [])


    for(let i = 0;i < info.length;i++){
        elem = <>
            { elem }
            
            <IonCard class="о-card">
                <IonCardHeader>
                <div className="os-right">
                    <ul className="os-ul1">
                        <li className="os-li1">
                            <div>
                                <div>
                                    <IonIcon className= "os-icon" icon= { readerOutline }
                                        color = {
                                            info[i].Статус >= 1 ? "success" : "warning"
                                        }
                                    ></IonIcon>
                                </div>
                                <div>
                                    <IonText
                                        color = {
                                            info[i].Статус >= 1 ? "success" : "warning"
                                        }
                                    >
                                        {
                                            info[i].Статус >= 1 ? "Принят" : "В ожидании" 
                                        }
                                    </IonText>
                                </div>
                            </div>                         
                        </li>
                        <li className="os-li1">
                            <div>
                                <div>
                                    <IonIcon className= "os-icon" icon= { giftOutline }
                                        color = {
                                            info[i].Статус >= 2 ? "success" 
                                                : info[i].Статус === 1 ? "warning"
                                                : "medium"
                                        }
                                    > </IonIcon>
                                </div>
                                <div>
                                    <IonText
                                        color = {
                                            info[i].Статус >= 2 ? "success" 
                                                : info[i].Статус === 1 ? "warning"
                                                : "medium"
                                            }                                    
                                    >
                                        {
                                            info[i].Статус >= 2 ? "Собран" 
                                                : info[i].Статус === 1 ? "Собирается"
                                                : "Сборка"
                                        }
                                    </IonText>
                                </div>
                            </div>
                        </li>
                        <li className="os-li1">
                            <div>
                                <div>
                                    <IonIcon className= "os-icon" icon= { bicycleOutline }
                                        color = {
                                            info[i].Статус >= 3 ? "success" 
                                                : info[i].Статус === 2 ? "warning"
                                                : "medium"
                                        }

                                    > </IonIcon>
                                </div>
                                <div>
                                    <IonText
                                        color = {
                                            info[i].Статус >= 3 ? "success" 
                                                : info[i].Статус === 2 ? "warning"
                                                : "medium"
                                        }                                    
                                    >
                                        {
                                            info[i].Статус >= 3 ? "Доставлен" 
                                                : info[i].Статус === 2 ? "В доставке"
                                                : "Курьер"
                                        }
                                    </IonText>
                                </div>
                            </div>
                        </li>
                    </ul>
                    </div>
                </IonCardHeader>
                <IonCardContent>
                <IonRow>
                    <IonCol size="4">
                    {/* <img src = { info[i].Картинка === "" ? imageSharp : info[i].Картинка}  alt = ""/>   */}
                    
                    <QRCode value= { info[i].Номер + ";" + info[i].Дата + ";" } size={ 100 }/>
                    </IonCol>
                    <IonCol size="8">
                    <IonRow>
                        <IonCol>{ "Заказ " + getNum(info[i].Номер) + " от " +  getISO(info[i].Дата) }</IonCol>
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
            <IonCol size="2">
                <IonIcon icon = { arrowBackOutline } 
                    class= "back ml-1 mt-1 pr-btn2"
                    onClick = {()=>{
                    Store.dispatch({type: "route", route: "back"})
                    }}
                /> 
            </IonCol>
            <IonCol size="8">
                <div className="pr-header">
                    <IonText><h3><b>Мои заказы</b></h3></IonText>
                    </div>
            </IonCol>
            <IonCol size="2">
                <IonIcon icon = { syncCircleOutline } 
                    class= "back ml-1 mt-1 pr-btn2"
                    onClick = {()=>{
                        getOrders()
                    }}
                /> 
            </IonCol>
            </IonRow> 
        <div>
            <IonLoading message = "Подождите" isOpen = { load } />
            { elem }
        </div>
    </div>
    </>
}

function getISO(dat) {
    let st = dat.substring(0, 10);
    st = st.replace('40', '20').replace('-', '.').replace('-', '.');
    return st
}
function getNum(num) {
    let st = num
    while(st[0] === '0') {
        st = st.substring(1);
    }
    return st
}

export function OHistory(props):JSX.Element{
    const [info, setInfo] = useState<any>([])
    const [load, setLoad] = useState(false)

    async function getOrders(){
        setLoad(true);
        let login = Store.getState().login;
        let res = await  getData("method", {
            method: "История",
            phone: login.code,
        })
        console.log(res);
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
                    <div className="os-right">
                    <ul className="os-ul1">
                        <li className="os-li1">
                            <div>
                                <div>
                                    <IonIcon className= "os-icon" icon= { readerOutline }
                                        color = {
                                            info[i].Статус >= 1 ? "success" : "warning"
                                        }
                                    ></IonIcon>
                                </div>
                                <div>
                                    <IonText
                                        color = {
                                            info[i].Статус >= 1 ? "success" : "warning"
                                        }
                                    >
                                        {
                                            info[i].Статус >= 1 ? "Принят" : "В ожидании" 
                                        }
                                    </IonText>
                                </div>
                            </div>                         
                        </li>
                        <li className="os-li1">
                            <div>
                                <div>
                                    <IonIcon className= "os-icon" icon= { giftOutline }
                                        color = {
                                            info[i].Статус >= 2 ? "success" 
                                                : info[i].Статус === 1 ? "warning"
                                                : "medium"
                                        }
                                    > </IonIcon>
                                </div>
                                <div>
                                    <IonText
                                        color = {
                                            info[i].Статус >= 2 ? "success" 
                                                : info[i].Статус === 1 ? "warning"
                                                : "medium"
                                            }                                    
                                    >
                                        {
                                            info[i].Статус >= 2 ? "Собран" 
                                                : info[i].Статус === 1 ? "Собирается"
                                                : "Сборка"
                                        }
                                    </IonText>
                                </div>
                            </div>
                        </li>
                        <li className="os-li1">
                            <div>
                                <div>
                                    <IonIcon className= "os-icon" icon= { bicycleOutline }
                                        color = {
                                            info[i].Статус >= 3 ? "success" 
                                                : info[i].Статус === 2 ? "warning"
                                                : "medium"
                                        }

                                    > </IonIcon>
                                </div>
                                <div>
                                    <IonText
                                        color = {
                                            info[i].Статус >= 3 ? "success" 
                                                : info[i].Статус === 2 ? "warning"
                                                : "medium"
                                        }                                    
                                    >
                                        {
                                            info[i].Статус >= 3 ? "Доставлен" 
                                                : info[i].Статус === 2 ? "В доставке"
                                                : "Курьер"
                                        }
                                    </IonText>
                                </div>
                            </div>
                        </li>
                    </ul>
                    </div>
                </IonCardHeader>
                <IonCardContent>
                <IonRow>
                    <IonCol size="4">
                    {/* <img src = { info[i].Картинка === "" ? imageSharp : info[i].Картинка}  alt = ""/>   */}
                    
                    <QRCode value= { info[i].Номер + ";" + info[i].Дата + ";" } size={ 100 }/>
                    </IonCol>
                    <IonCol size="8">
                    <IonRow>
                        <IonCol>{ "Заказ " + getNum(info[i].Номер) + " от " +  getISO(info[i].Дата) }</IonCol>
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


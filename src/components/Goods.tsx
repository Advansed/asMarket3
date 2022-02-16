import { useEffect, useState } from "react"
import { Store } from "../pages/Store"
import { IonCard, IonImg, IonText, IonButton, IonCardSubtitle, IonProgressBar} from '@ionic/react';

import './Goods.css'
import { useHistory } from "react-router";
import { addBasket } from "./Basket";


export function     Goods():JSX.Element {
    const [info, setInfo]   = useState<any>([])
    const [sub, setSub]     = useState<any>()
    const [upd, setUpd]     = useState(0)
    const [load, setLoad]   = useState(true)
    // const [value, setValue] = useState(0)

    Store.subscribe({num: 21, type: "sub", func: ()=>{
        setSub(Store.getState().sub)
    }})
    Store.subscribe({num: 22, type: "goods", func: ()=>{
        setUpd(upd + 1)
    }})
    Store.subscribe({num: 23, type: "sav_goods", func: ()=>{
        setUpd(upd + 1)
    }})
    Store.subscribe({num: 24, type: "search", func: ()=>{
        let src = Store.getState().search
        let goods = Store.getState().goods;
        let jarr: any = [];
        if(src !== "") {
            goods.forEach((e)=>{

                if(e.Наименование.toUpperCase().includes(src.toUpperCase())){
                    jarr = [...jarr, e]
                }
            })
            setInfo(jarr)
        } else {
            setUpd(upd + 1)
        }
    }})
    Store.subscribe({num: 25, type: "load", func: ()=>{
        setLoad(Store.getState().load !== "");
    }})
    
    useEffect(()=>{
        if(sub !== "") {
            let goods = Store.getState().goods
            let jarr : any = []
            goods.forEach(elem => {
                if(elem.СубКатегория === sub?.Код) jarr = [...jarr, elem]
            });
            setInfo(jarr)
        }
    }, [sub, upd])

    useEffect(()=>{
        setLoad(Store.getState().load !== "");
        setSub(Store.getState().sub)
        return ()=>{
            Store.unSubscribe(21);
            Store.unSubscribe(22);
        }
    }, [])

    let elem = <></>
    for(let i = 0;i < info.length;i++){
        elem = <>
            { elem }
            <Good info = { info[i] }  />
        </>
    }

    return <>

    <div>
        <div className="catalogue">
            <div className = { load ? "" : "hidden" }>
                <IonProgressBar 
                    type = "indeterminate"
                />
            </div>
            <div className="g-content">
                { elem }
            </div>
            <div className="g-ediv">
                <IonText class="a-right">  
                    All rights reserved asMarket
                </IonText>
            </div>
        </div>
    </div>
    </> 
}

export function     Good(props):JSX.Element {
    const [ info ]= useState( props.info )

  let elem = <></>
  let hist = useHistory();

  if(info !== undefined)
    elem = <>
        <div className="g-card-div">
            <IonCard class="g-card"
                onClick={()=>{
                    Store.dispatch({type: "gcard", gcard: info})
                    hist.push("/page1/_" + info.Код)    
//                    Store.dispatch({type: "route", route: "/page/#" + info.Код})
                }}
            >
                <div className={ info.СтараяЦена > 0 ? "g-discount" : "hidden"}>
                    <div className="a-center"><b>{ (100 - info.Цена * 100 / info.СтараяЦена).toFixed(0) + "%" }</b></div>
                </div>                    
                <IonImg src={ info.Картинка } className="g-img"/>
                <div className="ml-1 mr-1">
                    <IonCardSubtitle className="g-text"> { info.Наименование } </IonCardSubtitle>
                </div>
                <div className="g-position">
                <IonButton className="g-size-btn" color="new" size="small"
                    onClick = {(e)=>{
                        addBasket(info, 1)
                        e.stopPropagation()
                    }}
                >+</IonButton>
                <IonButton className="g-size-btn2" color="new" size="small">
                    {
                    info.СтараяЦена > 0 
                        ?<>
                        <div>
                            <div className="f-10">
                                <b>{  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.Цена)}</b>
                            </div>
                            <div className="red f-10">
                                <b>{  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.СтараяЦена)}</b>
                            </div>
                        </div>
                        </>
                        :<div className="f-12">
                        <b >{  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info?.Цена)}</b>
                        </div>
                    }
                    
                </IonButton>  
                <IonButton className="g-size-btn" color="new" size="small"
                    onClick = {(e)=>{
                        addBasket(info, -1)
                        e.stopPropagation()
                    }}                
                >-</IonButton>
                </div>
                <div>
                </div>
            </IonCard>
        </div>
    </>
  return elem
}
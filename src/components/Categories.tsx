import { useEffect, useState } from "react"
import { Store } from "../pages/Store"
import { IonImg, IonText, IonChip } from '@ionic/react';

import './Categories.css'
import './bootstrap.css'
import './style.css'

export function Categories():JSX.Element {
    const [info, setInfo] = useState<any>([])
    const [cats, setCats] = useState<any>([])
    const [cat,  setCat]  = useState<any>()

    Store.subscribe({num: 11, type: "categories", func : ()=>{ setInfo( Store.getState().categories ) }})

    useEffect(()=>{ setInfo( Store.getState().categories ) }, [])

    useEffect(()=> { 
        if(info.length > 0) {
            setCats(info[0]) 
            Store.dispatch({type: "category", category: info[0]})
        }
    }, [info])

    useEffect(()=> { 
        if(cats.Категории?.length > 0) {
            setCat(cats.Категории[0]) 
            Store.dispatch({type: "sub", sub: cats.Категории[0]})
        }
    }, [cats])

    function onClick(info, num) {
        if(num === 0) { setCats(info) }
        if(num === 1) { 
            setCat(info)
            Store.dispatch({type: "sub", sub: info})
        }
    }
    let elem = <></>

    for(let i = 0;i < info.length;i++){
        elem = <>
            { elem }
            <div className="ct-card" key = { i }
                onClick = { () => onClick(info[i], 0) }
            >
                <div className="ct-circle">
                <IonImg class="ct-img" src={ info[i].Картинка } /></div>
                <div className="ct-text">
                    <IonText> { info[i].Наименование }</IonText>
                </div>

            </div>
        </>
    }

    let items = <></>

    
    for(let i = 0;i < cats.Категории?.length;i++){
        
        items = <>
            { items }

            <IonChip className={ "ct-chip " + "bgcolor" + (i + 1).toString()} key = { i }
                onClick = { () => onClick( cats.Категории[i], 1)}
            >
                { cats.Категории[i].Наименование }
            </IonChip>
        </>
    }

    return <>
        <div className="ct-content">
            { elem }
        </div>
        <div className="ct-content">
            <div className="ct-chip-div"> 
                { items }
            </div>
        </div>
    </>
}


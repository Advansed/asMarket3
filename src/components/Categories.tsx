import { useEffect, useState } from "react"
import { Store } from "../pages/Store"
import { IonImg, IonText, IonChip } from '@ionic/react';

import './Categories.css'
import './bootstrap.css'
import './style.css'

interface t_info {
    categories :    any,
    cats:           any,
    cat:            any,
}

const i_info : t_info | any = {
    categories:     [],
    cats:           [],
}
export function Categories(props):JSX.Element {
    const [info, setInfo] = useState<t_info>(i_info)
    const [upd,  setUpd]  = useState(0)

    function Load(){
        info.categories = Store.getState().categories;
        if(info.categories.length > 0){
            info.cats = info.categories[0];
            if(info.cats.Категории?.length > 0) {
                info.cat = info.cats.Категории[0] 
                Store.dispatch({type: "sub", sub: info.cat})
            }
            setInfo( info );setUpd(upd + 1);
        }
        console.log(upd)
    }

    Store.subscribe({num: 11, type: "categories", func : ()=>{ 
        Load()
    }})

    Store.subscribe({num: 12, type: "category", func : ()=>{ 
        console.log("category")
        let Код = Store.getState().category;
        var ind = info.categories.findIndex(function(b) { 
            return b.Код === Код
        });
        if( ind < 0 ) ind = 0
        info.cats = info.categories[ind]
        if(info.cats.Категории?.length > 0) {
            info.cat = info.cats.Категории[0] 
            Store.dispatch({type: "sub", sub: info.cat})
        }
        console.log(info)
        setInfo( info );setUpd(upd + 1)
    }})

    useEffect(()=>{ 
        console.log("useEffect")
        Load()

        return ()=>{
            // Store.unSubscribe(11)
            // Store.unSubscribe(12)
        }
    }, [])

    function onClick(inf, num) {
        if(num === 0) { 
            let in_fo = {
                categories: [],
                cats:       [],
                cat:        "",
            }
            in_fo.categories = info.categories
            in_fo.cats = inf; 
            in_fo.cat = inf.Категории[0];
            setInfo(in_fo)
            Store.dispatch({type: "sub", sub: in_fo.cat})
        }
        if(num === 1) { 
            let in_fo = {
                categories: [],
                cats:       [],
                cat:        "",
            }
            in_fo.categories = info.categories
            in_fo.cats = info.cats; 
            in_fo.cat = inf;
            setInfo(in_fo);
            Store.dispatch({type: "sub", sub: inf})
        }
    }
    let elem = <></>

    for(let i = 0;i < info.categories.length;i++){
        elem = <>
            { elem }
            <div className="ct-card" key = { i }
                onClick = { () => onClick(info.categories[i], 0) }
            >
                <div className="ct-circle">
                <IonImg class="ct-img" src={ info.categories[i].Картинка } /></div>
                <div className="ct-text">
                    <IonText> { info.categories[i].Наименование }</IonText>
                </div>

            </div>
        </>
    }

    let items = <></>

    
    for(let i = 0;i < info.cats.Категории?.length;i++){
        
        items = <>
            { items }

            <IonChip className={ "ct-chip " + "bgcolor" + (i + 1).toString()} key = { i }
                onClick = { () => onClick( info.cats.Категории[i], 1)}
            >
                { info.cats.Категории[i].Наименование }
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


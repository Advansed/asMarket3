
import { useEffect, useState } from 'react';
import { IonSlide,IonImg, IonChip, IonSlides, IonText } from '@ionic/react';
import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


import './Carusel.css';

import { Store } from '../pages/Store';

export function Carusel():JSX.Element {
    const [info,    setInfo]    = useState<any>( [] )
    const [upd,     setUpd]     = useState(0)
     
    useEffect(()=>{

        setInfo(Store.getState().actions)

    },[upd])

    Store.subscribe({num: 7, type: "actions", func: ()=>{
        setInfo(Store.getState().actions)
    }})

    function Slides():JSX.Element {
        let elem = <>
            <div className="box">
                <Carousel
                    autoPlay = { true }
                    infiniteLoop = { true} 
                    interval = { 3000 }

                >
                        { info.map((e, ind) =>{ 
                            return <>
                                <div key = { e.Код } 
                                    className="slides"
                                    onClick = {()=>{
                                        Store.dispatch({type: "action", action: e})
                                        Store.dispatch({type: "route", route: "/page/action"})
                                    }}                
                                >
                                    <img src={ e.Картинка } alt ="" className = "sl-img"
                                />
                                </div>

                            </>
                        })}
                </Carousel>
            </div>
        </>
        return elem
    }

    return <Slides />

}


export function Action():JSX.Element {
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
                <div className="circle">
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

            <IonChip className="ct-chip bgcolor2" key = { i }
                onClick = { () => onClick( cats.Категории[i], 1)}
            >
                { cats.Категории[i].Наименование }
            </IonChip>
        </>
    }

    return <>
            <div className="discountsliderbox">
            <div className="discountscrollbar">
                <div className="discountbox1"><b className="boxcolor">Акция 1</b></div>
                <div className="discountbox2"><b className="boxcolor">Акция 2</b></div>
                <div className="discountbox3"><b className="boxcolor">Акция 3</b></div>
                <div className="discountbox4"><b className="boxcolor">Акция 4</b></div>
                <div className="discountbox5"><b className="boxcolor">Акция 5</b></div>
            </div>
        </div>
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
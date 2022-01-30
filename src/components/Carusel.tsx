
import { ReactText, useEffect, useState } from 'react';
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

    function Slide(e):JSX.Element {
        let elem = <>
            <div key = { e.Код } 
                className="slides"
                onClick = {()=>{
                    if(e.URL !== "") {
                        Store.dispatch({type: "action", action: e})
                        Store.dispatch({type: "route", route: "/page/action"})
                    }
                }}                
            >
                <img src={ e.Картинка } alt ="" className = "sl-img"
            />
            </div>

        </>

        return elem
    }

    function Slides():JSX.Element {
        let elem = <>
            <div className="box">
                <Carousel
                    autoPlay = { true }
                    infiniteLoop = { true} 
                    interval = { 3000 }
                    showThumbs = { false }

                >   
                    { info.map((e, ind) =>{ 
                        return <>
                            <div key = { e.Код } 
                                className="slides"
                                onClick = {()=>{
                                    if(e.URL !== "") {
                                        Store.dispatch({type: "action", action: e})
                                        Store.dispatch({type: "route", route: "/page/action"})
                                    }
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

    Store.subscribe({num: 11, type: "action", func : ()=>{ setInfo( Store.getState().action ) }})

    useEffect(()=>{ setInfo( Store.getState().action ) }, [])

    useEffect(()=> { 
        setInfo( Store.getState().action )
    }, [])

    return <>
        <div>
            <iframe src= { info?.URL } 
                width = "100%"
                height = { window.screen.height }
            >
                Ваш браузер не поддерживает плавающие фреймы!
            </iframe>
        </div>
    </>

}
import { IonAlert, IonButton, IonCard, IonImg, IonInput, IonText, IonToolbar } from "@ionic/react";
import { useState } from "react";
import MaskedInput from "../mask/reactTextMask";
import { getData1C, Store } from "../pages/Store";
import './Registration.css'

let phone = "";

async function getSMS1(phone) {

    let login = Store.getState().login;
    let res = await  getData1C("Регистрация", {
        Телефон:    phone,    
    })
    console.log(res)
    if(res.Код === 100) {
        login = res.Данные;
        login.type = "login"
        Store.dispatch( login )

        res = await  getData1C("ПолучитьСМС", {
            Телефон:    phone,    
        })
    
        console.log("ПолучитьСМС")
        console.log(res)
        if(res.СМС !== undefined) {
            Store.dispatch({type: "login", SMS: res.СМС })
            Store.dispatch({type: "route", route: "/page/SMS"})
        }
    
    }


}


export function Login(props): JSX.Element {
    let elem = <>
            <div className="r-card">
            <img src ="assets/22.png" />
            </div>
            <div className="r-circle"><div className="r-circle2"></div></div>
            <div className="r-content">
            <div className="lg-input">
                <MaskedInput 
                    mask={[ '+', /\d/,'(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                    className="m-input"
                    placeholder = "+7(---)-- -- --"
                    onChange={(e: any) => {
                        let st = e.target.value;
                        phone = st;
                    }}
                        
                />
            </div>
            
            <div className="btn-r">
                  <button
                    slot="end"
                    onClick={()=>{
                        console.log("SMS")
                        let login = Store.getState().login
                        if(login === "") login = { code: phone }
                        else login.code = phone
                        console.log(login)
                        Store.dispatch({type: "login", login: login})
                        getSMS1(phone)
                    }}  className="orange-clr-bg"
                  >
                    Получить код
                  </button>
            </div>
            </div>
          
    </>

    return elem
}

export function SMS(props):JSX.Element {
    const [tires, setTires] = useState("----")
    const [alert1, setAlert1] = useState(false)
    const [alert2, setAlert2] = useState(false)
    let elem = <>
            <div className="r-card">
                 <img src = "assets/123.png"/>
            </div>
            <div className="r-circle3"><div className="r-circle2"></div></div>
            <div className="r-content">

            <div className="lg-sms-box">

                <div className="lg-div-1">
                    <span></span>
                    { tires }
                </div>

                <IonInput
                    className = "lg-sms-input"
                    type = "text"
                    inputMode = "numeric"
                    maxlength = { 4 }
                    onIonChange = {(e)=>{
                        let val = e.detail.value;
                        switch (val?.length) {
                            case 0:     setTires("----");break;       
                            case 1:     setTires("---");break;       
                            case 2:     setTires("--");break;       
                            case 3:     setTires("-");break;       
                            case 4:     setTires("");break;       
                            default:    setTires("----");break;       
                        }
                        if(val?.length === 4) {
                            let SMS = Store.getState().login.SMS
                            console.log(Store.getState().login)
                            if(SMS === val) {
                                setAlert1(true)    
                                Store.dispatch({type: "auth", auth: true})
                                Store.dispatch({type: "route", route: "/page/options"})
                                localStorage.setItem("marketAs.login", phone)
                            } else 
                                setAlert2(true)
                        }
                        
                    }}
                    />
            </div>
            <div className="btn-r">
                  <button
                    slot="end"
                    onClick={()=>{
                        getSMS1(phone)
                    }}  className="orange-clr-bg"
                  >
                    Отправить код повторно
                  </button>
            </div>
            </div>
        <IonAlert
          isOpen={ alert1 }
          onDidDismiss={() => setAlert1(false)}
          cssClass='my-custom-class'
          header={'Успех'}
          message={'Регистрация завершена'}
          buttons={['Ок']}
        />
        <IonAlert
          isOpen={ alert2 }
          onDidDismiss={() => setAlert2(false)}
          cssClass='my-custom-class'
          header={'Ошибка'}
          message={'Неверный код'}
          buttons={['Ок']}
        />
    </>

    return elem;
}
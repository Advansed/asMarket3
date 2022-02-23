import { IonAlert, IonInput, IonLoading } from "@ionic/react";
import localForage from "localforage";
import { useState } from "react";
import MaskedInput from "../mask/reactTextMask";
import { getData1C, Phone, Store } from "../pages/Store";
import './Registration.css'

export function Login(props): JSX.Element {
    const [ login ] = useState( Store.getState().login )
    const [ load, setLoad] = useState( false )

    async function getSMS1() {

        setLoad( true ) 
        let res = await  getData1C("Регистрация", {
            Телефон:    login.code,    
        })
        console.log(res)
        if(res.Код === 100) {
            
            login.code              = res.Данные.code;
            login.name              = res.Данные.name;
            login.address           = res.Данные.address;
            login.paymentmethod     = res.Данные.paymentmethod;
            login.image             = res.Данные.image;
            
            res = await  getData1C("ПолучитьСМС", {
                Телефон:    login.code,    
            })
        
            console.log("ПолучитьСМС")
            console.log(res)
            if(res.СМС !== undefined) {
                Store.dispatch({type: "login", SMS: res.СМС })
                Store.dispatch({type: "route", route: "/page1/SMS"})
            }
        
        }
        setLoad( false ) 
    
    
    }
    

    let elem = <>
            <IonLoading isOpen= { load } message = "Подождите" />
            <div className="r-card">
            <img src ="assets/22.png" alt="Картинка"/>
            </div>
            <div className="r-circle"><div className="r-circle2"></div></div>
            <div className="r-content">
                <div className="lg-input">
                    <div className="ml-1 flex fl-center" >
                        <div>+7</div>
                    </div>
                    <MaskedInput
                        mask={[ '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                        className="m-input "
                        autoComplete="off"
                        placeholder="(___) ___-__-__"
                        value = { login.code }
                        id='1'
                        type='text'
                        onChange={(e: any) => {
                            let st = e.target.value;
                            login.code = Phone(st);
                            console.log(login.code)
                        }}
                    />                
                    </div>
            
            <div className="btn-r">
                  <button
                    slot="end"
                    onClick={()=>{
                        getSMS1()
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
        const [ login ] = useState( Store.getState().login )
        const [tires, setTires] = useState("----")
        const [alert1, setAlert1] = useState(false)
        const [alert2, setAlert2] = useState(false)

        async function getSMS1() {

            let res = await  getData1C("Регистрация", {
                Телефон:    login.code,    
            })
            console.log(res)
            if(res.Код === 100) {
                
                login.code              = res.Данные.code;
                login.name              = res.Данные.name;
                login.address           = res.Данные.address;
                login.paymentmethod     = res.Данные.paymentmethod;
                login.image             = res.Данные.image;
                
                res = await  getData1C("ПолучитьСМС", {
                    Телефон:    login.code,    
                })
            
                console.log("ПолучитьСМС")
                console.log(res)
                if(res.СМС !== undefined) {
                    login.SMS              = res.СМС;
                    Store.dispatch({type: "route", route: "/page1/SMS"})
                }
            
            }
        
        
        }

        async function setLog(){
            await localForage.setItem("asmrkt.login", login );
        }
        
        let elem = <>
                <div className="r-card">
                    <img src = "assets/123.png" alt="Картинка" />
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
                                let SMS = login.SMS
                                if(SMS === val) {
                                    setLog()
                                    setAlert1(true)    
                                    Store.dispatch({type: "auth", auth: true})                               

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
                            getSMS1()
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
            buttons={[
                {
                  text: 'Ок',
                  handler: () => {
                    console.log('Confirm Okay');
                    Store.dispatch({type: "route", route: "/page1/options"})
                  }
                }
              ]}
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
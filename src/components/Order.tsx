import { IonAlert, IonCol 
  , IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonModal
  , IonTextarea, IonContent, IonRow, IonButton } from "@ionic/react";
import { bicycleOutline, homeOutline, phonePortrait
        , timeOutline, readerOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { AddressSuggestions } from "react-dadata";
import MaskedInput from "../mask/reactTextMask";
import { Store } from "../pages/Store";
import './Order.css'
import './react-dadata.css'
import { v4 as uuidv4 } from 'uuid';

declare type Dictionary = {
    [key: string]: any;
  };


export function   Order( props ):JSX.Element {
    const [message,   setMessage] = useState("")
    const [upd,       setUpd]     = useState(0)
    const [modal, setModal]       = useState(false)


    useEffect(()=>{
        console.log(" -- useeffect --")
        let info = Store.getState().order
        console.log(info)
        let sum = Store.getState().basket.reduce(function(a, b){ return a + b.Сумма;}, 0)
        if(info.Phone === "")
          info.Phone =           Store.getState().login.code
        if(info.CustomerName === "")
          info.CustomerName =    Store.getState().login.name
        if(info.Address === "")
          info.Address =         Store.getState().login.addres
        
        info.Total =           sum

        if(info.StatusId === "")
          info.StatusId =        uuidv4()
        
        let del = Store.getState().market.sum;
        let tabs = Store.getState().market.tabs;
        
        if(info.DeliveryMethod === "Доставка") {
          for(let i = 0; i < tabs.length; i++){
              if(tabs[i].sum <= sum) {
                del = tabs[i].del
              }
          }
          info.DelivSum =        del;
        } else info.DelivSum =        0;
        info.OrderDetails =    Store.getState().basket.map(e =>{
          return {
              ProductId:  e.Код, 
              Name:       e.Наименование, 
              Weight:     e.Вес, 
              Amount:     e.Количество, 
              Price:      e.Цена, 
              Total:      e.Сумма}
        })
        
        let orders = Store.getState().orders;
        if(orders.length > 0){
            let old = orders[0];
            info.Address  = old.Адрес
            info.lat      = old.lat
            info.lng      = old.lng
        }

        Store.dispatch(info)
        setUpd(upd + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    let item : Dictionary = {"city": "Якутск"};
    let dict : Dictionary[] = []; dict.push(item);

  function phone(st){
      if(st !== undefined) {
        if(st.length > 2)
          return st.substring(2)
      } else return ""
  }


  function Page1():JSX.Element {
      const [info, setInfo] = useState(Store.getState().order)
      const [upd, setUpd] = useState(0)

      useEffect(()=>{
        setInfo(Store.getState().order)
      }, [])

      // Store.subscribe({num: 71, type: "order", func: ()=>{
      //   setInfo(Store.getState().order)
      //   setUpd(upd + 1)
      // }})
      
      let elem = <>
      
        <IonContent>
          <IonItem lines="none">
              <h4><b>Оформление заказа </b></h4>
          </IonItem>
          {/* Телефон */}
          <IonItem lines="none">
            <IonIcon slot= "start" icon={ phonePortrait }/>
            <IonLabel position="stacked">Телефон</IonLabel>
            <div className="o-phone">
              <div>+7</div>
              <div>
                <MaskedInput
                  mask={[ ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                  className="m-input"
                  autoComplete="off"
                  placeholder="(___) ___-__-__"
                  id='1'
                  type='text'
                  value = { phone(info?.Phone) }
                  onChange={(e: any) => {
                    let st = e.target.value;
                    info.Phone = "+7" + st;
                  }}
                />
              </div>
            </div>
          </IonItem>
          {/* Доставка */}
          <IonItem lines="none">
            <IonIcon slot="start" icon={ bicycleOutline } />
            <IonLabel position="stacked">Доставка</IonLabel>
            <IonSelect value={ info?.DeliveryMethod } okText="Да" cancelText="Нет" onIonChange={e => {
                info.DeliveryMethod = e.detail.value
                if(info?.DeliveryMethod === "Доставка") {
                  info.DelivSum = info.Total  < 1000 ? Store.getState().market.sum : 0
                } else {
                  info.Address = "";
                  info.DelivSum = 0;
                }
                setUpd(upd + 1)
            }}>
              <IonSelectOption value="Доставка">Доставка до адреса</IonSelectOption>
              <IonSelectOption value="Самовывоз">Самовывоз</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className = { info?.DeliveryMethod === "Доставка" ? "" : "hidden"}>
            <IonItem>
              <IonIcon slot= "start" icon={ timeOutline }/>
              <IonLabel position="stacked">Удобное время для доставки</IonLabel>
              <MaskedInput
                mask={[/[1-9]/, /\d/, ':', /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, ':', /\d/, /\d/,]}
                className="m-input"
                autoComplete="off"
                placeholder="12:00 - 21:00"
                id='2'
                type='text'
                value = { info?.DeliveryTime }
                onChange={(e: any) => {
                    info.DeliveryTime = (e.target.value as string);
                  }}
              />
            </IonItem> 
            <IonItem lines="none" onClick={()=>{
              setModal(true)
            }}>
              <IonIcon slot= "start" icon={ homeOutline }/>
              <IonLabel position="stacked"> Адрес </IonLabel>
              <IonText> { info?.Address } </IonText>
            </IonItem>           
            <IonItem lines="none">
              <IonIcon slot= "start" icon={ homeOutline }/>
              <IonLabel position="stacked"> Подъезд </IonLabel>
              <Entrance  />
            </IonItem>           
          </div>
          <IonItem lines="none">
              <IonIcon slot= "start" icon={ readerOutline }/>
              <IonLabel position="stacked"> Комментарий </IonLabel>
              <IonTextarea
                value = { info?.CustomerComment }
                onIonChange={(e: any) => {
                    info.CustomerComment = (e.target.value as string);
                  }}
              />
          </IonItem> 
          <IonRow>
          <IonCol size="6">
            <button
              onClick={()=>{
                Store.dispatch({type: "route", route: "back"})
              }}  className="or-orange-clr-bg"
            >
              Назад
            </button>
          </IonCol>
          <IonCol size="6">        
            <button
              onClick={()=>{
                Proov( info )
              }}  className="or-orange-clr-bg"
            >
              Далее
            </button>
          </IonCol>            
        </IonRow>        

        </IonContent>
        <IonAlert
              isOpen={ message !== "" }
              onDidDismiss={() => setMessage("")}
              cssClass='my-custom-class'
              header={'Ошибка'}
              message={ message }
              buttons={['OK']}
            />
    
        </>
      return elem
  }


  function Proov( info ){
      
      if( info.deliveryMethod === "Доставка" && info.Address === "") 
        setMessage("Заполните адрес")
      else 
      if(info.Phone === "" || info.Phone.indexOf('_') > -1)
        setMessage("Заполните телефон")
      else 
        Store.dispatch({ type: "route", route: "payment" })
        
  }

  
  function Entrance(  ):JSX.Element {
      const [value, setValue] = useState(0);

      useEffect(()=>{
        setValue(Store.getState().order.entrance)
      },[])
      let elem = <>
              <IonRow>
                <IonCol size="12">
                    <IonButton className="bs-size-btn left" color="new" 
                      onClick = {(e)=>{
                        let val = value - 1;
                        if(val < 0) val = 0;
                        setValue(val)
                        
                        Store.dispatch({type: "order", entrance: val})
                        
                      }}
                    >-
                    </IonButton>
                    <button  className="white-bg text-align "> 
                      <h5 className="bs-quan">{ value.toFixed() } </h5> 
                    </button>
                    <IonButton className="bs-size-btn " color="new" 
                      onClick = {()=>{
                        let val = value + 1;
                        if(val > 9) val = 9;
                        setValue(val)
                        Store.dispatch({type: "order", entrance: val})
                      }}
                    >+
                    </IonButton>
                  </IonCol>
              </IonRow>    
        
      </>

      return elem
  }


  function ModalAddress():JSX.Element {
      const [ info ] = useState(Store.getState().order)
      const [alert1,  setAlert1] = useState(false)
      const [alert2,  setAlert2] = useState(false)
      const [ value ]  = useState("")
      const [addr,    setAddr]   = useState<any>({
          city: "", street: "", house: "", flat: ""
      })  
      const [upd, setUpd] = useState( 0 )

    //   function getISO(dat) {
    //     if(dat === undefined) return ""
    //     let st = dat.substring(0, 10);
    //     st = st.replace('40', '20').replace('-', '.').replace('-', '.');
    //     return st
    // }
  
      let elem = <>
            <div className="mt-3">
              <h1 className="a-center">Введите адрес</h1>
            </div>
            {/* <div className="r-circle3"><div className="r-circle2"></div></div> */}
            <div className="r-content">
            <div className= "ml-2 mr-2 mt-2"> 
            
              <AddressSuggestions
                  token="23de02cd2b41dbb9951f8991a41b808f4398ec6e"
                  filterLocations ={ dict }
                  hintText = { "г. Якутск" }
                  defaultQuery = { value }
                  value = { info?.Address }
                  
                  onChange={(e)=>{
                    console.log(e)
                    if(e !== undefined)
                      info.Address = e.value
                      info.lat = e?.data.geo_lat
                      info.lng = e?.data.geo_lon

                      addr.city = e?.data.city
                      addr.street = e?.data.street
                      addr.house = e?.data.house
                      addr.flat = e?.data.flat

                      setAddr(addr); setUpd(upd + 1);
                  }}
                /> 
              </div>
              <div className = "o-addr-item">
                { 'Город: ' + addr.city }
              </div>
              <div className = "o-addr-item">
                { 'Улица: ' + addr.street }
              </div>
              <div className = "o-addr-item">
                { 'Дом: ' + (addr.house === null ? "  -  " : addr.house) }
              </div>
              <div className = "o-addr-item">
                { 'Квартира: ' + (addr.flat === null ? "  -  " : addr.flat) }
              </div>
              <div>
                  <div className="btn-r">
                        <button
                          slot="end"
                          onClick={()=>{
                              setModal(false)
                          }}  className="orange-clr-bg"
                        >
                          Закрыть
                        </button>
                  </div>
              </div>
              </div>
  
          <IonAlert
            isOpen={ alert1 }
            onDidDismiss={() => setAlert1(false)}
            cssClass='my-custom-class'
            header={'Успех'}
            message={'Промокод активирован'}
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


    let elem = <>
      <Page1 />
    </>

    return <>
      { elem }
      <IonModal isOpen = { modal }
          cssClass = "o-modal"
        >
          <ModalAddress />
      </IonModal> 
    </>;
  }
  
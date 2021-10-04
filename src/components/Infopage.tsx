import { IonButton, IonCard, IonCardHeader, IonIcon, IonItem, IonList, IonText, IonCol,IonRow } from "@ionic/react"
import { arrowBackOutline } from "ionicons/icons"
import { Store } from "../pages/Store"
import './Infopage.css'

export function InfoPage1(props):JSX.Element {
    let elem = <>
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
                    <IonText><h3><b>Контакты</b></h3></IonText>
                    </div>
            </IonCol>
            </IonRow> 
            
            <div className="info-content">
                <p>
                    Вопросы, пожелания или жалобы Вы можете адресовать нам по следующим контактным данным:						
                </p>
                <div className="mt-1">
                    <b>Телефон:</b> +7(777)777-77-77	
                </div>
                <div  className="mt-1">
                    <b>E-mail:</b> asmrkt@mail.ru
                </div>
            </div>
    </>

    return elem
}


export function InfoPage2(props):JSX.Element {
    let elem = <>
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
                    <IonText><h3><b>Помощь</b></h3></IonText>
                    </div>
            </IonCol>
            </IonRow>
            <details>
                <summary>График работы</summary>
                <div className="info-content2">
                <p>Понедельник - пятница: 9:00 - 21:00</p>
                <p>Суббота: 10:00 - 17:00</p>
                <p>Воскресенье: выходной</p>
                </div>
            </details>

            <details>
                <summary><b>Обработка заказов</b></summary>
                <div className="info-content2">
                <p>
                    Заказы принимаются круглосуточно, но обрабатываются в рабочее время менеджера.						
                </p>
                <p>
                    После оформления заказа с вами свяжется менеджера для уточнения деталей и подтверждения заказа.						
                </p>
                </div>
            </details>

            <details>
                <summary><b>Минимальная сумма заказа</b></summary>
                <div className="info-content2">
                <p>
                Минимальная сумма заказа для бесплатной доставки курьером по г. Якутск составляет 1000 рублей. При самовывозе минимальная сумма заказа не ограничена.						
                </p>
                </div>
            </details>

            <details>
                <summary><b>Оплата заказа</b></summary>
                <div className="info-content2">
                <p>
                Оплата наличными или банковской картой при получении заказа. К оплате принимаются карты Visa, Mastercard, Maestro, МИР.						
                </p>
                <p>
                Вам будут выданы все необходимые документы для оформления покупки товарный и кассовый чек.						
                </p>
                <p>
                Для юридических лиц и индивидуальных предпринимателей возможна оплата по безналичному расчёту без НДС.						
                </p>
                <p>
                В этом случае доставка осуществляется на следующий рабочий день после зачисления оплаты на счет.						
                </p>
                <p>
                Для получении оплаченного заказа обязательно наличие у получателя документа удостоверяющего личность и доверенности или печати организации.						
                </p>
                </div>
            </details>

            <details>
                <summary><b>Доставка</b></summary>
                <div className="info-content2">
                <p>
                Служба доставки интернет-магазина «АсМаркет» выполнит доставку выбранного вами товара:						
                </p>
                <p>
                - если заказ оформлен до 16:00, то мы доставим его на Ваш адрес на следующий день с 10 до 19.00.						
                </p>
                <p>
                - если заказ оформлен после 16:00, то мы доставим его на Ваш адрес через 1 рабочий день с 10 до 19:00.						
                </p>
                <p>
                Доставка осуществляется только в прeделах указанной зоны.						
                </p>            
                </div>
            </details>


            {/* <iframe 
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A7737a696313c546289bcee3d00294f36e52d07aa4084cfff1f9c4de08f127d47&amp;source=constructor" 
                width="100%" 
                height="100%" 
                // frameborder="0"
            >
            </iframe>													 */}
        
    </>
    return elem
}
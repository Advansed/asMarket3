
import { IonText } from "@ionic/react"

export function Action1():JSX.Element {
    let elem = <>
        <div>
            <h1 className="a-center"> Акция!!! </h1>
        </div>
        <div className = "ml-1 mr-1 mt-4">
            <img src="assets/Actions.png" alt = ""/>
        </div>
    </>
    return elem
}
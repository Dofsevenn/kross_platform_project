import React from 'react';
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/react";
import ITrip from "../modules/ITrip";


const TripCard = ({ id, description, title, user, image_filename}: ITrip) => {

    return (
        <IonCard >
             <img src={`https://backend-iw3hrary.nhost.app/storage/o/public/${image_filename}`} width="400" height="300" alt=""/>
            <IonCardHeader>
                <IonCardSubtitle>
                    @ {user.display_name} &bull; {/*? likes     Hadde tenkt å legge til likes, men ble ikke tid*/}
                </IonCardSubtitle>
                <IonCardTitle>
                    {title}
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {description}
            </IonCardContent>
        </IonCard>
    )
}

export default TripCard;
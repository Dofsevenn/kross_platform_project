import React from 'react';
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/react";
import IPost from "../modules/IPost";
import {storage} from "../utils/nhost";


const PostCard = ({ id, description, title, user, image_filename}: IPost) => {

    return (
        <IonCard >
             <img src={`https://backend-iw3hrary.nhost.app/storage/o/public/${image_filename}`} width="400" height="300"/>
            <IonCardHeader>
                <IonCardSubtitle>
                    @ {user.display_name} &bull; ? likes
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

export default PostCard;
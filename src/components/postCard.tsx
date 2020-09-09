import React from 'react';
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/react";
import IPost from "../modules/IPost";

const PostCard = ({ id, description, title, user}: IPost) => {

    return (
        <IonCard >
            {/* <img src={image} width="400" height="300"/>*/}
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
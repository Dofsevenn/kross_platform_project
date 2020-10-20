import React from "react";
import {IonAvatar, IonCard, IonItem, IonLabel, IonList} from "@ionic/react";
import IPost from "../modules/IPost";
import IComments from "../modules/IComments";

const CommentsCard = ({ id, text, user, profileImageUrl }: IComments) => {

    return(
        <IonItem >
            <IonAvatar slot="start">
                { <img src={profileImageUrl} />}
            </IonAvatar>
            <IonLabel>
                {/*<h3>{date}</h3>*/}
                <h2>{user.display_name}</h2>
                <p>{text}</p>
            </IonLabel>
        </IonItem>
    )
}

export default CommentsCard;
import React from 'react';
import {
    IonAvatar, IonBackButton, IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import PostCard from "../components/postCard";
import IPost from "../modules/IPost";
import CommentsCard from "../components/CommentsCard";

const Detail= (props: any) => {

    const post: IPost = props.location?.state?.post;

    if (!post) {
        return <div></div>
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>POST</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <PostCard {...post} />
                <IonCard>
                    <IonList>
                        {
                            post?.comments?.map((comment, i) => (
                                <CommentsCard key={i} {...comment} />
                            ))
                        }
                    </IonList>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default Detail;

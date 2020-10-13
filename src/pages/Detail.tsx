import React from 'react';
import {
    IonAvatar, IonBackButton, IonButton, IonButtons,
    IonCard,
    IonContent,
    IonHeader, IonIcon,
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
import {trashOutline} from "ionicons/icons";
import {auth} from "../utils/nhost";

const Detail= (props: any) => {

    const post: IPost = props.location?.state?.post;

    if (!post) {
        return <div></div>
    }

    // "trash-outline"
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" />
                    </IonButtons>
                    <IonTitle>POST</IonTitle>
                    {
                        post.user.id === auth.getClaim('x-hasura-user-id') &&
                            <IonButtons slot="end">
                                <IonButton onClick={() => alert(`slett id ${post.id}`)}>
                                    <IonIcon icon={trashOutline}/>
                                </IonButton>
                            </IonButtons>
                    }
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


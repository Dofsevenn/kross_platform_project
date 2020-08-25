import {
    IonButton,
    IonButtons,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useState} from 'react';

const Home = () => {
    const [posts, setPosts] = useState(
        [
            {
                id: 1,
                title: "Fin tur på fjellet.",
                description: "Hardangervidda var fantastisk i dag!",
                userName: "Kjetil",
                image: "assets/hardangervidda1.jpeg",
                likes: 200
            },
            {
                id: 2,
                title: "Mye vind idag.",
                description: "Hardangervidda var fantastisk i dag, men blåste litt!",
                userName: "Oddvar",
                image: "assets/Hardangervidda2.jpeg",
                likes: 15
            }
        ]
    );

    // How to add a object to the state with spread operator and wrapper function
   const handleClick = () => {
        const post = {
            id: 3,
            title: "En regnværsdag",
            description: "Hardangervidda ruler",
            userName: "Odny",
            image: "assets/hein.jpg",
            likes: 70
        }
        setPosts(posts => [post, ...posts])
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>TDSGram</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleClick}> + </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {
                    posts.map(post => (
                        <IonCard key={post.id}>
                            <img src={post.image} width="300" height="300"/>
                            <IonCardHeader>
                                <IonCardSubtitle>
                                    @ {post.userName} &bull; {post.likes} likes
                                </IonCardSubtitle>
                                <IonCardTitle>
                                    {post.title}
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {post.description}
                            </IonCardContent>
                        </IonCard>
                    ))
                }
            </IonContent>
        </IonPage>
    );
};

export default Home;

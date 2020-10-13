import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import IPost from "../modules/IPost";
import PostCard from "../components/postCard";
import gql from 'graphql-tag';
import {useQuery} from "@apollo/client";
import IPostList from "../modules/IPostList";
import styled from "styled-components";
import {exitOutline} from 'ionicons/icons';
import {auth} from "../utils/nhost";

const GET_POSTS = gql`
    query{
        posts{
            id
            title
            description
            image_filename
            user{
                id
                display_name
            }
            comments{
                id
                text
                user{
                    display_name
                }
            }
        }
    }
`;

const Home = () => {
    let history = useHistory();
    const {loading, data } = useQuery<IPostList>(GET_POSTS);

    if (loading) {
        return <IonLabel>Laster...</IonLabel>
    }

    console.log(data)

    /*
    const [posts, setPosts] = useState<IPost[]>(
        [
            {
                id: 1,
                title: "Fin tur på fjellet.",
                description: "Hardangervidda var fantastisk i dag!",
                userName: "Kjetil",
                image: "assets/hardangervidda1.jpeg",
                likes: 200,
                comments: [{
                    userName: "Kurt",
                    text: "Det var nydelig, jeg vil og!",
                    date: "4. juli 2020",
                    profileImageUrl: "https://ionicframework.com/docs/demos/api/list/avatar-han.png"
                    },
                    {
                        userName: "Ask",
                        text: "Fantastic!",
                        date: "19. juli 2020",
                        profileImageUrl: "https://ionicframework.com/docs/demos/api/list/avatar-rey.png"
                    }]
            },
            {
                id: 2,
                title: "Mye vind idag.",
                description: "Hardangervidda var fantastisk i dag, men blåste litt!",
                userName: "Oddvar",
                image: "assets/Hardangervidda2.jpeg",
                likes: 15,
                comments: [{
                    userName: "Arne",
                    text: "Deilig, ingenting er som litt bris i fjeset!",
                    date: "5. august 2020"
                }]
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
            likes: 70,
            comments: []
        }
        setPosts(posts => [post, ...posts])
    } */

    const logout = async () => {
        try {
            await auth.logout();
            history.replace("/login")
        } catch (e) {
            alert("Something went wrong. You are not logged out")
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={logout}>
                            <IonIcon icon={exitOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>POST FEED</IonTitle>
                    <IonButtons slot="end">
                        {/* <IonButton onClick={handleClick}> + </IonButton> */}
                        <PictureButton onClick={() => history.push("/newPost")}>Ny post</PictureButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {
                    data?.posts.map(post => (
                        <Link style={{textDecoration:'none'}} key={post.id} to={{
                            pathname:`/detail/${post.id}`,
                            state: {
                                post
                            }
                        }}>
                        <PostCard {...post} />
                        </Link>
                    ))
                }
            </IonContent>
        </IonPage>
    );
};

const PictureButton = styled(IonButton)`
  &::part(native) {
    background-color: darkgreen;
    border-radius: 5px;
    color: white;
  }
`;

export default Home;

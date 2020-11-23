import React, {useState} from 'react';
import {
    IonAvatar, IonBackButton, IonButton, IonButtons,
    IonCard,
    IonContent,
    IonHeader, IonIcon, IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import PostCard from "../components/postCard";
import IPost from "../modules/IPost";
import ICommentList from "../modules/ICommentList";
import CommentsCard from "../components/CommentsCard";
import {exitOutline, logInOutline, personAddOutline, trashOutline} from "ionicons/icons";
import {auth} from "../utils/nhost";
import {gql} from "@apollo/client/core";
import {useMutation, useSubscription} from "@apollo/client";
import styled from "styled-components";
import {useHistory} from "react-router-dom";

const GET_COMMENTS = gql`
    subscription getCommentsByPostID($post_id: Int!) {
        posts_by_pk(id: $post_id) {
            comments {
                text
                user {
                    display_name
                }
            }
        }
    }
`;

const INSERT_COMMENT = gql`    
    mutation InsertComment($comment: comments_insert_input!) {
        insert_comments_one(object: $comment) {
            user_id,
            post_id,
            text
        }
    }
`;

const DELETE_POST = gql`
    mutation DeletePost($post_id: Int!) {
        delete_comments(
            where: {
                post_id: {
                    _eq: $post_id
                }
            }
        ) {
            affected_rows
        }
        delete_posts_by_pk(
            id: $post_id
        ) {
            id
        }
    }
`;

const Detail= (props: any) => {

    let history = useHistory()
    const post: IPost = props.location?.state?.post;

    const [comment, setComment] = useState<string>("");
    const [insertCommentMutation] = useMutation(INSERT_COMMENT);
    const [deletePostMutation] = useMutation(DELETE_POST);

    const { loading, data } = useSubscription<ICommentList>(GET_COMMENTS, {
        variables: {
            post_id: post?.id
        },
        fetchPolicy: "no-cache"
    });

    if (!post) {
        return <div></div>
    }

    if (loading) { return <IonLabel>Laster kommentarer!</IonLabel> }

    const insertComment = async () => {
        try {
            await insertCommentMutation({
                variables: {
                    comment: {
                        post_id: post?.id,
                        user_id: auth.getClaim('x-hasura-user-id'),
                        text: comment
                    }
                }
            })
        } catch (e) {
            console.warn(e);
        }
    }

    const deletePost = async () => {
        try {
            await deletePostMutation({
                variables: {
                    post_id: post.id
                }
            })
            history.replace("/home"); //Den  går til home siden men rendrer ikke home siden..???

        } catch (e) {
            console.warn(e)
        }
    }

    const logout = async () => {
        try {
            await auth.logout();
            history.replace("/login")
        } catch (e) {
            alert("Something went wrong. You are not logged out")
        }
    }

    // Kode opp bruker registrering som øvelse til neste gang
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" />
                    </IonButtons>
                    <IonTitle>POST</IonTitle>
                    {
                        (auth.isAuthenticated() === true) &&
                        <IonButtons slot="end">
                            <IonButton onClick={logout}>
                                <IonIcon icon={exitOutline}></IonIcon>
                            </IonButton>
                            <IonButton onClick={deletePost}>
                                <IonIcon icon={trashOutline}/>
                            </IonButton>
                        </IonButtons>

                    }
                    {
                        (auth.isAuthenticated() === false) &&
                        <IonButtons slot="end">
                            <IonButton onClick={() => history.push("/login")}>
                                <IonIcon icon={logInOutline}></IonIcon>
                            </IonButton>
                            <RegisterButton onClick={() => history.push("/register")}>
                                <IonIcon icon={personAddOutline}/>
                            </RegisterButton>
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
                <IonCard>
                    <IonList>
                        <IonItem>
                            <IonInput placeholder={"Skriv inn en kommentar"}
                                      onIonInput={(e:any) => setComment(e.target.value)}/>
                        </IonItem>
                        <IonItem>
                            <IonButton onClick={insertComment}>Legg til kommentar</IonButton>
                        </IonItem>
                    </IonList>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

const RegisterButton = styled(IonButton)`
    padding-left: 10px;
`;

export default Detail;


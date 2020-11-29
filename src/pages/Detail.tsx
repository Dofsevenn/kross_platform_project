import React, {useState} from 'react';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";

import ICommentList from "../modules/ICommentList";
import CommentsCard from "../components/CommentsCard";
import {exitOutline, logInOutline, personAddOutline, trashOutline} from "ionicons/icons";
import {auth} from "../utils/nhost";
import {gql} from "@apollo/client/core";
import {useMutation, useSubscription} from "@apollo/client";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import TripCard from '../components/tripCard';
import ITrip from "../modules/ITrip";
import jQuery from 'jquery';

const GET_COMMENTS = gql`
    subscription getCommentsByTripID($trip_id: Int!) {
        trips_by_pk(id: $trip_id) {
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
            trip_id,
            text
        }
    }
`;

const DELETE_TRIP = gql`
    mutation DeleteTrip($trip_id: Int!) {
        delete_comments(
            where: {
                trip_id: {
                    _eq: $trip_id
                }
            }
        ) {
            affected_rows
        }
        delete_trips_by_pk(
            id: $trip_id
        ) {
            id
        }
    }
`;

const Detail= (props: any) => {
    let history = useHistory()

    // Lagrer dataene som blir sendt fra home siden i en variabel
    const trip: ITrip = props.location?.state?.trip;

    const [comment, setComment] = useState<string>("");
    const [insertCommentMutation] = useMutation(INSERT_COMMENT);
    const [deleteTripMutation] = useMutation(DELETE_TRIP);

    // Henter kommentarer direkte fra databasen i stenden for å hente det gjennom home siden. Dette for å kunne
    // oppdatere kommentarene med en gang det blir lagt til en ny
    const { loading, data } = useSubscription<ICommentList>(GET_COMMENTS, {
        variables: {
            trip_id: trip?.id
        },
        fetchPolicy: "no-cache"
    });

    if (!trip) {
        return <div></div>
    }

    if (loading) { return <IonLabel>Laster kommentarer!</IonLabel> }

    const insertComment = async () => {
        try {
            await insertCommentMutation({
                variables: {
                    comment: {
                        trip_id: trip?.id,
                        user_id: auth.getClaim('x-hasura-user-id'),
                        text: comment
                    }
                }
            })
            jQuery("ion-input").prop("value", "");
        } catch (e) {
            console.warn(e);
        }
    }

    const deleteTrip = async () => {
        try {
            await deleteTripMutation({
                variables: {
                    trip_id: trip.id
                }
            })
        } catch (e) {
            console.warn(e)
        } finally {
            setTimeout(() => {
                    history.goBack(); // .goBack fungerer her, men ikke .replace. Det gir ikke helt mening for meg at
                    // ikke .replace fungerer, men .replace ga kun svart skjerm
                    // Virker som at det er visse situasjoner hvor den ikke oppdaterer riktig med .goBack også, men
                    // skjermen blir iallfall ikke svart.
                },
                300
            )
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

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" />
                    </IonButtons>
                    <IonTitle>TUR</IonTitle>
                    { /* Denne koden sjekker displayer forskjellige ting i toolbaren avhengig om bruker er inlogget
                    eller ikke*/
                        (auth.isAuthenticated() === true) &&
                        <IonButtons slot="end">
                            <IonButton onClick={logout}>
                                <IonIcon icon={exitOutline}></IonIcon>
                            </IonButton>
                            <IonButton onClick={deleteTrip}>
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
                <TripCard {...trip} />
                <IonCard>
                    <IonList>
                        {
                            data?.trips_by_pk?.comments?.map((comment, i) => (
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
                        <IonItem> {/* Hadde planer om å legge til avatar også, derfor vises det et lite felt til det
                        i appen*/}
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


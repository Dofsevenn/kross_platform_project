import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import React from 'react';
import {Link, useHistory} from "react-router-dom";
import TripCard from "../components/tripCard";
import gql from 'graphql-tag';
import {useSubscription} from "@apollo/client";
import styled from "styled-components";
import {exitOutline, logInOutline, personAddOutline} from 'ionicons/icons';
import {auth} from "../utils/nhost";
import ITripList from "../modules/ITripList";

const GET_TRIPS = gql`
    subscription {
        trips{
            id
            title
            description
            start_point
            trip_length
            image_filename
            coordinates
            user{
                id
                display_name
            }
            comments{
                id
                text
                user{
                    id  
                    display_name
                }
            }
        }
    }
`;

const Home = () => {
    let history = useHistory();

    const {loading, error, data } = useSubscription<ITripList>(GET_TRIPS);

    if (loading) {
        return <IonLabel>Laster...</IonLabel>
    }

    console.log(loading)
    console.log(error)
    console.log(data)

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
                        <IonBackButton defaultHref="/welcome"/>
                    </IonButtons>
                    <IonTitle>TURER</IonTitle>
                    {
                        (auth.isAuthenticated() === true) &&
                        <IonButtons slot="end">
                            <IonButton onClick={logout}>
                                <IonIcon icon={exitOutline}></IonIcon>
                            </IonButton>
                            <NewTripButton onClick={() => history.push("/newTrip")}>Ny tur</NewTripButton>
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
                {
                    data?.trips.map((trip: any) => (
                        <Link style={{textDecoration:'none'}} key={trip.id} to={{
                            pathname:`/detail/${trip.id}`,
                            state: {
                                trip
                            }
                        }}>
                        <TripCard {...trip} />
                        </Link>
                    ))
                }
            </IonContent>
        </IonPage>
    );
};

const NewTripButton = styled(IonButton)`
  &::part(native) {
    background-color: darkgreen;
    border-radius: 5px;
    color: white;
  }
`;

const RegisterButton = styled(IonButton)`
    padding-left: 10px;
`;

export default Home;

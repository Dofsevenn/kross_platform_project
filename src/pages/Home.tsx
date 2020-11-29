import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent, IonFooter,
    IonHeader,
    IonIcon,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
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
    const [weather, setWeather] = useState({})
    const [count, setCount] = useState(0)

    if (loading) {
        return <IonLabel>Laster...</IonLabel>
    }

    console.log(loading)
    console.log(error)
    console.log(data)

    const logout = async () => {
        try {
            await auth.logout();
        } catch (e) {
            alert("Something went wrong. You are not logged out")
        }finally {
            setTimeout(() => { // Har opplevd litt utstabilitet på om den viser login siden,
                // derfor satte jeg på en timeout her.
                    history.replace("/login")
                }, 300
            )
        }
    }

    return (
        <IonPage>
             <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/welcome"/> {/* Må teste .md og .ios */}
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
            <IonContent >
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
            {/*
            <IonFooter>
                <IonButton onClick={() => setCount(count + 1)}>Fetch weather</IonButton>
            </IonFooter> */}
        </IonPage>
    );
};

const NewTripButton = styled(IonButton)`
  &::part(native) { // To target an element inside of a shadow tree from the outside. I wanted to try it, and it works
    background-color: darkgreen;
    border-radius: 5px;
    color: white;
    padding-left: 10px;
  }
`;

const RegisterButton = styled(IonButton)`
    padding-left: 10px;
`;

export default Home;

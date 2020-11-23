import React from "react";

import {IonButton, IonContent, IonIcon, IonLabel, IonPage} from "@ionic/react";
import {useHistory} from "react-router";
import {logInOutline, personAddOutline} from "ionicons/icons";
import styled from "styled-components";
import {useSubscription} from "@apollo/client";

// Ting som skjer underveis, og som kanskje bør gjøres mer av hvis jeg har tid:
// TODO: Innslag av bruk av Styled Components

// Ting som bør være med for god karakter:
// TODO: Arbeidliste fredag!
// TODO: Kunne legge til turer (NewTrip klassen)
// TODO: Kunne registrere bruker til databasen (Hvis ikke det allerede funker da.)
// TODO: Må kunne ta bilde og legge det til i listen og på turinfo (Tillegge, kunne legge til flere bilder på en tur)
// TODO: Fillagring av blandt annet bilder

// Bug fixes, eller som må skrives om i readme:
// TODO: Når jeg går tilbake til inlogging etter å ha logget inn så redirigerer den meg tilbake til home. Men home
//  siden oppdateres ikke, den blir svart

// TODO: Arbeidsliste ubestemt tid:
// TODO: GPS (Capasitor geolocation) for å få turens startpunkt
// TODO: Tilbakemeldinger feedback bruker-interraksjon (feilmeldinger, loading-spinnere, m.m.)
// TODO: Vurdering rating av turen -> Tenk IMDB
// TODO: Fremvisning av turen med Google maps -> Kobles sammen emd api ---> Ta inn værappen fra ios?? (enkel versjon)
// TODO: Bruk av eksterne API (Rest/ GraphQL) -> Kan kobles sammen med kart ---> Ta inn værappen fra ios?? (enkel versjon)

// Hvis jeg har tid:
// TODO: Bruk av npm moduler (npm install [pakkenavn] --save)
// TODO: Implementasjon av Accessibility-prinsipper.

const Welcome = () => {
    let history = useHistory()

    return (
        <IonPage>
            <IonContentStyled>
                <CenterContainer>
                    <PageTitle>TURGLEDE</PageTitle>
                    <GuestButton onClick={() => history.push("/home")}>
                        Se turer!
                    </GuestButton>
                    <LoginButton  onClick={() => history.push("/login")}>
                        <IonIcon icon={logInOutline}></IonIcon>
                    </LoginButton>
                    <RegisterButton onClick={() => history.push("/register")}>
                        <IonIcon icon={personAddOutline}/>
                    </RegisterButton>
                </CenterContainer>
            </IonContentStyled>
        </IonPage>
    )
};

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("assets/nordmarka.jpeg") no-repeat fixed;
  background-size: cover;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  align-self: center;
  font-weight: bold;
  font-family: 'Quicksand', sans-serif;
  color: #ffffff;
`;

const LoginButton = styled(IonButton)`
  width: 75%;
  align-self: center;
  margin-top:30px;
`;

const GuestButton = styled(IonButton)`
  width: 75%;
  --background: #428cff;
  align-self: center;
  margin-top:30px;
  --ion-text-color: #ffffff;
`;

const RegisterButton = styled(IonButton)`
  width: 75%;
  align-self: center;
  margin-top:30px;
`;

const CenterContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;;
    height: 100%;
`;

export default Welcome;
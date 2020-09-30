import React, {useState} from 'react';
import {
    IonCard,
    IonContent,
    IonFabButton,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonSpinner,
    IonToast,
    useIonViewWillEnter
} from "@ionic/react";
import {auth} from "../utils/nhost";
import {useHistory} from "react-router-dom";
import styled from "styled-components"
import {arrowForwardCircle} from "ionicons/icons";
import {renderToStaticMarkup} from "react-dom/server";
import WaveBlob from "../components/WaveBlob";

const waveBlobString = encodeURIComponent(renderToStaticMarkup(<WaveBlob/>))

const Login = () => {
    let history = useHistory()
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [ShowErrorToast, setShowErrorToast] = useState<boolean>(false);

    useIonViewWillEnter(() => {
        if (auth.isAuthenticated()) {
            /* history.replace("/home"); */
        }
    })

    const authenticateUser = async () => {
        setIsAuthenticating(true);
        try {
            await auth.login(emailAddress, password);
            history.push("/home"); // Har push her nå bare for enkelt å komme tilbake til login. Skal være .replace
            setIsAuthenticating(false);
        } catch (exception) {
            console.log(exception);
            setIsAuthenticating(false);
            setShowErrorToast(true);
        }
    }


    return (
        <IonPage>
            <IonContentStyled>
                <CenterContainer>
                    <PageTitle>TDSGram</PageTitle>
                    <LoginCard>
                        <IonList>
                            <IonItem>
                                <IonInput placeholder="Epost-adresse"
                                          onIonInput={(e: any) => setEmailAddress(e.target.value)}></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput placeholder="Passord" type="password"
                                          onIonInput={(e: any) => setPassword(e.target.value)}></IonInput>
                            </IonItem>
                        </IonList>
                    </LoginCard>
                    <LoginButton onClick={authenticateUser}>
                        {
                            isAuthenticating ?
                                <IonSpinner name="crescent"/> :
                                <IonIcon icon={arrowForwardCircle}/>
                        }


                    </LoginButton>
                </CenterContainer>
                <IonToast
                    isOpen={ShowErrorToast}
                    onDidDismiss={() => setShowErrorToast(false)}
                    message={"Feil brukernavn/passord!"}
                    duration={3000}
                    color="warning"/>
            </IonContentStyled>
        </IonPage>
    )
};

const LoginCard = styled(IonCard)`
  padding: 10px;
`;

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("data:image/svg+xml,${waveBlobString}") no-repeat fixed;
  background-size: cover;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  align-self: center;
  color: black;
  font-family: 'Quicksand', sans-serif;
`;

const LoginButton = styled(IonFabButton)`
  --background: #37323E;
  align-self: center;
`;

const CenterContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;;
    height: 100%;
`;

// #37323E    #662C91
export default Login;
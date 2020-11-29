import React, {useState} from "react";
import {
    IonBackButton,
    IonButton, IonButtons,
    IonCard,
    IonContent,
    IonFabButton, IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonSpinner, IonTitle,
    IonToast, IonToolbar,
    useIonViewWillEnter
} from "@ionic/react";
import {useHistory} from "react-router";
import {auth} from "../utils/nhost";
import {arrowForwardCircle, personAddOutline} from "ionicons/icons";
import styled from "styled-components";

const Login = () => {
    let history = useHistory()
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [showErrorToast, setShowErrorToast] = useState<boolean>(false);

    const authenticateUser = async () => {
        setIsAuthenticating(true);
        try {
            await auth.login(emailAddress, password);
            history.replace("/home"); // Har push her nå bare for enkelt å komme tilbake til login. Skal være .replace
            setIsAuthenticating(false);
        } catch (exception) {
            console.log(exception);
            setIsAuthenticating(false);
            setShowErrorToast(true);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/welcome"/>
                    </IonButtons>
                    <IonTitle>LOGIN</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContentStyled>
                <CenterContainer>
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
                    <RegisterButton onClick={() => history.push("/register")}>
                        <IonIcon icon={personAddOutline}/>
                    </RegisterButton>
                </CenterContainer>
                <IonToast
                    isOpen={showErrorToast}
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
  background: url("assets/nordmarka.jpeg") no-repeat fixed;
  background-size: cover;
`;

const LoginButton = styled(IonFabButton)`
  align-self: center;
`;

const RegisterButton = styled(IonButton)`
  width: 75%;
  align-self: center;
  margin-top:70px;
`;

const CenterContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;;
    height: 100%;
`;

export default Login;
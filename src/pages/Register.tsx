import React, {useState} from "react";
import {
    IonBackButton, IonButton,
    IonButtons,
    IonCard, IonContent,
    IonFabButton, IonHeader,
    IonIcon,
    IonInput, IonItem,
    IonList,
    IonPage, IonSpinner, IonTitle,
    IonToast,
    IonToolbar, useIonViewWillEnter, useIonViewWillLeave
} from "@ionic/react";
import {auth} from "../utils/nhost";
import {useHistory} from "react-router";
import {arrowForwardCircle, logInOutline, personAddOutline} from "ionicons/icons";
import styled from "styled-components";
import {LoginData} from "nhost-js-sdk/dist/types";

const Register = () => {
    let history = useHistory()

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
    const [showRegisterToast, setShowRegisterToast] = useState<boolean>(false);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [isRegister, setIsRegister] = useState<boolean>(false);

    const registerUser = async () => {
        setIsRegister(true);
        setIsAuthenticating(true);
        try {
            await auth.register(emailAddress, password, {display_name: userName});
            await auth.login(emailAddress, password);
            history.replace("/home");
            setIsRegister(false);
            setIsAuthenticating(false);
            setShowRegisterToast(true);
        } catch (exception) {
            console.error(exception)
            setShowErrorToast(true);
        }
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>REGISTRERING</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContentStyled>
                <CenterContainer>
                    <RegistrationCard>
                        <IonList>
                            <IonItem>
                                <IonInput placeholder="Brukernavn"
                                          onIonInput={(e: any) => setUserName(e.target.value)} />
                            </IonItem>
                            <IonItem>
                                <IonInput placeholder="Epost-adresse"
                                          onIonInput={(e: any) => setEmailAddress(e.target.value)} />
                            </IonItem>
                            <IonItem>
                                <IonInput placeholder="Passord" type="password"
                                          onIonInput={(e: any) => setPassword(e.target.value)} />
                            </IonItem>
                        </IonList>
                    </RegistrationCard>
                    <RegisterButton onClick={registerUser}>
                        {
                            isAuthenticating ?
                                <IonSpinner name="crescent"/> :
                                <IonIcon icon={personAddOutline}/>
                        }
                    </RegisterButton>
                    <LoginButton  onClick={() => history.push("/login")}>
                        <IonIcon icon={logInOutline}></IonIcon>
                    </LoginButton>
                </CenterContainer>
                {<IonToast
                    isOpen={showErrorToast}
                    onDidDismiss={() => setShowErrorToast(false)}
                    message={"Du må fylle ut skjemaet først, eventuelt så eksisterer bruker allerede."}
                    duration={3000}
                    color="warning"/> }
                {<IonToast
                    isOpen={showRegisterToast}
                    onDidDismiss={() => setShowRegisterToast(false)}
                    message={"Registrering var vellykket"}
                    duration={3000}
                    color="success"/> }
            </IonContentStyled>
        </IonPage>
    )
}

const RegistrationCard = styled(IonCard)`
  padding: 10px;
`;

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("assets/nordmarka.jpeg") no-repeat fixed;
  background-size: cover;
`;

const RegisterButton = styled(IonFabButton)`
  align-self: center;
  margin-top:20px;
`;
const LoginButton = styled(IonButton)`
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

export default Register;
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
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastColor, setToastColor] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    const registerUser = async () => {
        setIsRegistering(true);
        try {
            await auth.register(emailAddress, password, {display_name: userName});
            setIsRegistering(false);
            setToastColor("success")
            setToastMessage("Registrering var vellykket");
            setShowToast(true);
            await auth.login(emailAddress, password);
            setTimeout(() => { // Har timeout for å være sikker på at autentiseringen har skjedd.
                    history.replace("/home");
                },
                3200
            )
        } catch (exception) {
            console.error(exception)
            setToastColor("warning")
            setToastMessage("Du må fylle ut skjemaet først, eventuelt så eksisterer bruker allerede.");
            setShowToast(true);
            setIsRegistering(false);
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
                            isRegistering ?
                                <IonSpinner name="crescent"/> :
                                <IonIcon icon={personAddOutline}/>
                        }
                    </RegisterButton>
                    <LoginButton  onClick={() => history.push("/login")}>
                        <IonIcon icon={logInOutline}></IonIcon>
                    </LoginButton>
                </CenterContainer>
                { <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    color={toastColor}/> }
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
import React, {useState} from "react";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonFabButton,
    IonHeader, IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import styled from "styled-components";

import WaveBlob from "../components/WaveBlob";
import {renderToStaticMarkup} from "react-dom/server";
import {auth} from "../utils/nhost";
import { personAddOutline} from "ionicons/icons";
import {useHistory} from "react-router-dom";

const waveBlobString = encodeURIComponent(renderToStaticMarkup(<WaveBlob/>))


const Register = () => {

    let history = useHistory()

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
    const [showRegisterToast, setShowRegisterToast] = useState<boolean>(false);

    // auth.register(email, password, { display_name: "Joe Doe" });

    const registerUser = async () => {
        try {
            await auth.register(emailAddress, password);
            history.replace("/home");
            setShowRegisterToast(true);
        } catch (exception) {
            console.error(exception)
            setShowErrorToast(true);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Registrering</IonTitle>
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
                    <RegisterButton onClick={registerUser}>
                        <IonIcon icon={personAddOutline}/>
                    </RegisterButton>
                </CenterContainer>
                {<IonToast
                    isOpen={showErrorToast}
                    onDidDismiss={() => setShowErrorToast(false)}
                    message={"Du må fylle ut skjemaet først, eventuelt bruker eksisterer allerede."}
                    duration={3000}
                    color="warning"/> }
                {<IonToast
                    isOpen={showRegisterToast}
                    onDidDismiss={() => setShowRegisterToast(false)}
                    message={"Registrering var vellykket"}
                    duration={3000}
                    color="warning"/> }
            </IonContentStyled>
        </IonPage>
    )
}

const LoginCard = styled(IonCard)`
  padding: 10px;
`;

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("data:image/svg+xml,${waveBlobString}") no-repeat fixed;
  background-size: cover;
`;

const RegisterButton = styled(IonFabButton)`
  --background: #37323E;
  align-self: center;
  margin-top:20px;
`;

const CenterContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;;
    height: 100%;
`;

export default Register;

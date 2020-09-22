import React, {useState} from 'react';
import {
    IonButton,
    IonCard,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from "@ionic/react";
import {auth} from "../utils/nhost";
import {useHistory} from "react-router-dom";

const Login = () => {
    let history = useHistory()
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useIonViewWillEnter(() => {
        if(auth.isAuthenticated()) {
            history.replace("/home");
        }
    })

    const authenticateUser = async () => {
        try {
            await auth.login(emailAddress, password);
            history.replace("/home");
        } catch (exeption) {
            console.log(exeption);
        }
    }



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonList>
                        <IonItem>
                            <IonInput placeholder="Epost-adresse"
                                      onIonInput={(e: any) => setEmailAddress(e.target.value)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput placeholder="Passord" type="password"
                                      onIonInput={(e: any) => setPassword(e.target.value)}></IonInput>
                        </IonItem>
                        <IonButton onClick={authenticateUser} >
                            Login
                        </IonButton>
                    </IonList>
                </IonCard>
            </IonContent>
        </IonPage>
    )
};

export default Login;
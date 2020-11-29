import React, {useState} from "react";
import {useCamera} from "@capacitor-community/react-hooks/camera";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonProgressBar,
    IonTitle,
    IonToast,
    IonToolbar
} from "@ionic/react";
import {CameraResultType} from "@capacitor/core";
import styled from "styled-components";
import {auth, storage} from "../utils/nhost";
import gql from "graphql-tag";
import {useMutation} from "@apollo/client";
import {useHistory} from "react-router-dom";


// Her lager jeg en egen Hook som kan brukes andre steder i koden. Den må starte med ordet use slik som alle andre Hooks.
// Denne er for å laste opp bilde og å vise opplastings progessjon
const useImageUpload = () => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const startUploading = async ({ base64String, filenameWithExtension }: {
        base64String: string, filenameWithExtension: string }) => {
        try {
        await storage.putString(`/public/${filenameWithExtension}`,
            base64String, "data_url", null, (pe: ProgressEvent) => {
                setUploadProgress((pe.loaded / pe.total) * 100);
            });
        } catch (e) {
            console.warn("e");
        }
    }
    return {
        startUploading,
        uploadProgress
    }
}

// Hadde planer om å legge til mere info, men kom ikke lengre. Derfor er det flere rader i databasen en det er muligheter
// til å legge til her.
const INSERT_TRIP = gql`
    mutation InsertTrip($trip: trips_insert_input!) {
        insert_trips_one(object: $trip) {
            title,
            user_id,
            description,
            image_filename
        }
    }
`;

const NewTrip = () => {

    let history = useHistory()

    const {photo, getPhoto} = useCamera();
    const [insertTripMutation] = useMutation(INSERT_TRIP)
    const {startUploading, uploadProgress} = useImageUpload();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [filename, setFilename] = useState<string>("");
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastColor, setToastColor] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);

    const triggerCamera = async () => {
        await getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl
        });
        setFilename(`${Date.now().toString()}.jpeg`);
    };

    // Her bruker jeg startUploading funksjonen fra useImageUpload Hooken jeg laget lengre opp
    const uploadImage = async () => {
        if(photo?.dataUrl) {
            await startUploading({
                base64String: photo?.dataUrl!,
                filenameWithExtension: filename
            })
        } else {
            alert("Du må ta et bilde!");
        }
    }

    // Kjører uploadImage() her for å slippe å legge til bildet i databasen med egen knapp. Det er mer logist at man
    // laster opp bildet i samme knapp som å legge til tur
    const insertTrip = async () => {
        try {
            await uploadImage()
            await insertTripMutation({
                variables: {
                    trip: { // Hvis variabelnavnet og navnet på variabelen vi henter data fra er like så trenger
                            // vi ikke skrive title: title, men kan kun skrive title som under
                        title,
                        description,
                        image_filename: filename,
                        user_id: auth.getClaim('x-hasura-user-id')
                    }
                }
            });
        } catch (e) {
            console.log(e);
            setToastColor("warning")
            setToastMessage("Noe gikk galt, prøv igjen.");
            setShowToast(true);
        } finally { // Trenger en timeout for å være sikker på at turen er lagt til før den går tilbake til home siden
            setTimeout(() => {
                history.goBack();
            },
                300
        )
        }
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home"/>
                    </IonButtons>
                    <IonTitle>NY TUR</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContentStyled>
                <NewTripCard>
                    <img src={photo?.dataUrl} alt=""/>
                    <div>
                        <IonList>
                            <CustomItem>
                                <IonInput placeholder="Tittel" onIonInput={(e: any) => setTitle(e.target.value)}/>
                            </CustomItem>
                            <CustomItem>
                                <IonInput placeholder="Beskrivelse" onIonInput={(e: any) => setDescription(e.target.value)}/>
                            </CustomItem>
                        </IonList>
                        <NewTripButton onClick={triggerCamera}>Ta Bilde</NewTripButton>
                        <NewTripButton onClick={insertTrip}>Legg til ny tur</NewTripButton>
                        <IonProgressBar value={uploadProgress}/>
                    </div>
                </NewTripCard>
            </IonContentStyled>
            { <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                color={toastColor}/> }
        </IonPage>
    )
};

const CustomItem = styled(IonItem)`
    --background: black;
    margin: 10px;
  `;

const NewTripButton = styled(IonButton)`
    --background: darkgreen;
    --border-radius: 5px;
    color: white;
    margin: 10px;
`;

const NewTripCard = styled(IonCard)`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IonContentStyled = styled(IonContent)`
    --background: black;
    display: flex;
    flex-direction: column;
`;

export default NewTrip;
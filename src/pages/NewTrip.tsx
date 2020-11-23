import React, {useState} from "react";
import {useCamera} from "@capacitor-community/react-hooks/camera";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader, IonInput, IonItem, IonList,
    IonPage,
    IonTitle,
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

    const insertTrip = async () => {
        try {
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
            history.replace("/home"); //Den  går til home siden men rendrer ikke home siden..???
        } catch (e) {
            console.log(e);
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
                        <NewTripButton onClick={uploadImage}>Last opp bilde ({filename})</NewTripButton>
                        <NewTripButton onClick={insertTrip}>Legg til ny tur</NewTripButton>
                    </div>
                </NewTripCard>
            </IonContentStyled>
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
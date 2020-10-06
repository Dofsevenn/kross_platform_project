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

// Alle Hooks i react må starte med ordet use. Denne kan være en egen fil og importeres der hvor den trengs
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

const INSERT_POST = gql`
    mutation InsertPost($post: posts_insert_input!) {
        insert_posts_one(object: $post) {
            title,
            user_id,
            description,
            image_filename
        }
    }
`;

const NewPost = () => {

    let history = useHistory()

    const {photo, getPhoto} = useCamera();
    const [insertPostMutation] = useMutation(INSERT_POST)
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
/*
    const uploadImage = async () => {
        await storage.putString(`/public/test1.jpeg`, (photo?.dataUrl as string),
            "data_url", null, (pe: ProgressEvent) => {
                console.log(pe.loaded);
            });
    } */
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

    const insertPost = async () => {
        try {
            await insertPostMutation({
                variables: {
                    post: { // Hvis variabelnavnet og navnet på variabelen vi henter data fra er like så trenger
                            // vi ikke skrive title: title, emn kan kun skrive title som under
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
                    <IonTitle>NYTT INNLEGG</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContentStyled>
                <LoginCard>
                    <img src={photo?.dataUrl}/>
                    <div>
                        <IonList>
                            <CustomItem>
                                <IonInput placeholder="Tittel" onIonInput={(e: any) => setTitle(e.target.value)}/>
                            </CustomItem>
                            <CustomItem>
                                <IonInput placeholder="Beskrivelse" onIonInput={(e: any) => setDescription(e.target.value)}/>
                            </CustomItem>
                        </IonList>
                        <PictureButton onClick={triggerCamera}>Ta Bilde</PictureButton>
                        <PictureButton onClick={uploadImage}>Last opp bilde ({filename})</PictureButton>
                        <PictureButton onClick={insertPost}>Legg til ny post</PictureButton>
                    </div>
                </LoginCard>
            </IonContentStyled>
        </IonPage>
    )
};

const CustomItem = styled(IonItem)`
    --background: black;
    margin: 10px;
  `;

const PictureButton = styled(IonButton)`
    --background: darkgreen;
    --border-radius: 5px;
    color: white;
    margin: 10px;
`;

const LoginCard = styled(IonCard)`
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

export default NewPost;
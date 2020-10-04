import React, {useState} from "react";
import {useCamera} from "@capacitor-community/react-hooks/camera";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {CameraResultType} from "@capacitor/core";
import styled from "styled-components";
import {storage} from "../utils/nhost";

const useImageUpload = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const startUploading = async ({ base64String, filenameWithExtension }: {
        base64String: string, filenameWithExtension: string }) => {
        await storage.putString(`/public/${filenameWithExtension}`,
            base64String, "data_url", null, (pe: ProgressEvent) => {
                setUploadProgress((pe.loaded / pe.total) * 100);
            });
    }
    return {
        startUploading,
        uploadProgress
    }
}

const NewPost = () => {

    const {photo, getPhoto} = useCamera();
    const {startUploading, uploadProgress} = useImageUpload();

    const triggerCamera = async () => {
        await getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl
        });
    };
/*
    const uploadImage = async () => {
        await storage.putString(`/public/test1.jpeg`, (photo?.dataUrl as string),
            "data_url", null, (pe: ProgressEvent) => {
                console.log(pe.loaded);
            });
    } */
    const uploadImage = async () => {
        await startUploading({
            base64String: photo?.dataUrl!,
            filenameWithExtension: `${Date.now().toString()}.jpeg`
        })
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>NYTT INNLEGG</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContentStyled>
                <LoginCard>
                    <img src={photo?.dataUrl}/>
                    <div>
                        <PictureButton onClick={triggerCamera}>Ta Bilde</PictureButton>
                        <PictureButton onClick={uploadImage}>Last opp bilde</PictureButton>
                    </div>
                </LoginCard>
            </IonContentStyled>
        </IonPage>
    )
};

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
    display: flex;
    flex-direction: column;
`;

export default NewPost;
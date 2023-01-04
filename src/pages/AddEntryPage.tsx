import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    isPlatform
} from '@ionic/react';
import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from "../auth";
import {firestore, storage} from "../firebase";
import {useHistory} from "react-router";
import {CameraResultType, CameraSource, Plugins} from "@capacitor/core";

const {Camera} = Plugins;

const AddEntryPage: React.FC = () => {
    const {userId} = useAuth();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [pictureUrl, setPictureUrl] = useState("/assets/placeholder.png");
    const fileInputRef = useRef<HTMLInputElement>();

    useEffect(() => () => {
        if (pictureUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pictureUrl);
        }
    }, [pictureUrl]);

    const handleSave = async () => {
        setLoading(true);
        const entriesRef = firestore.collection('users').doc(userId)
            .collection('entries');
        const entryData = {date, title, pictureUrl, description}
        if (pictureUrl.startsWith('blob:')) {
            entryData.pictureUrl = await savePicture(pictureUrl);
        }
        entriesRef.add(entryData).then(() => {
            history.goBack();
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }

    const savePicture = async (blobUrl) => {
        const pictureRef = storage.ref(`/users/${userId}/pictures/${Date.now()}`);
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const snapshot = await pictureRef.put(blob);
        const url = await snapshot.ref.getDownloadURL();
        return url;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
            const file = event.target.files.item(0);
            const pictureUrl = URL.createObjectURL(file);
            setPictureUrl(pictureUrl);
        }
    }

    const handlePictureClick = () => {
        if (isPlatform('capacitor')) {
            Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt,
                width: 600
            }).then((photo) => {
                setPictureUrl(photo.webPath);
            }).catch((err) => {
                console.log(err);
            })
        } else {
            fileInputRef.current.click()
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>Add Entry</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Date</IonLabel>
                        <IonDatetime value={date} onIonChange={(event) => setDate(event.detail.value)}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Title</IonLabel>
                        <IonInput value={title} onIonChange={(event) => setTitle(event.detail.value)}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Picture</IonLabel>
                        <br/>
                        <input type="file" accept="image/*"
                               hidden ref={fileInputRef}
                               onChange={handleFileChange}/>
                        <img src={pictureUrl} alt=""
                             style={{cursor: 'pointer'}}
                             onClick={handlePictureClick}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonInput value={description} onIonChange={(event) => setDescription(event.detail.value)}/>
                    </IonItem>
                </IonList>
                <IonButton expand="block" onClick={handleSave}>Save</IonButton>
                <IonLoading isOpen={loading}/>
            </IonContent>
        </IonPage>
    );
};

export default AddEntryPage;

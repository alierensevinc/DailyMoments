import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from "react-router";
import {firestore} from "../firebase";
import {Entry, toEntry} from "../models";
import {useAuth} from "../auth";
import {trash as trashIcon} from "ionicons/icons";
import formatDate from "../date";

interface RouteParams {
    id: string;
}

const EntryPage: React.FC = () => {
    const {userId} = useAuth();
    const history = useHistory();
    const match = useRouteMatch<RouteParams>();
    const {id} = match.params;
    const [entry, setEntry] = useState<Entry>();

    useEffect(() => {
        const entryRef = firestore.collection("users").doc(userId).collection("entries").doc(id);
        entryRef.get().then((result) => {
            const entry = toEntry(result);
            setEntry(entry);
        }).catch((err) => {
            console.log(err);
        })
    }, [userId, id]);

    const handleDelete = () => {
        const entryRef = firestore.collection("users").doc(userId).collection("entries").doc(id);
        entryRef.delete().then(() => {
            history.goBack();
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>Entry {formatDate(entry?.date)}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleDelete}>
                            <IonIcon icon={trashIcon} slot="icon-only"/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h2>{entry?.title}</h2>
                <img src={entry?.pictureUrl} alt={entry?.title}/>
                <p>{entry?.description}</p>
            </IonContent>
        </IonPage>
    );
};

export default EntryPage;

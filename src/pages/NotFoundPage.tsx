import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar,} from '@ionic/react';
import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Not Found</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Not Found
            </IonContent>
        </IonPage>
    );
};

export default NotFoundPage;

import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import {useAuth} from "../auth";
import {auth} from "../firebase";

const RegisterPage: React.FC = () => {
    const {loggedIn} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = () => {
        setLoading(true);
        auth.createUserWithEmailAndPassword(email, password).then(() => {
            setLoading(false);
            setErrorMessage('');
        }).catch((err) => {
            setLoading(false);
            setErrorMessage(err.message);
        });
    }

    if (loggedIn) {
        return <Redirect to="/my/entries"/>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Email</IonLabel>
                        <IonInput type="email" value={email}
                                  onIonChange={(event) => setEmail(event.detail.value)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Password</IonLabel>
                        <IonInput type="password" value={password}
                                  onIonChange={(event) => setPassword(event.detail.value)}
                        />
                    </IonItem>
                </IonList>
                <IonButton expand="block" onClick={handleRegister}>Register</IonButton>
                <IonButton expand="block" fill="clear" routerLink="/login">
                    Already have an account ?
                </IonButton>
                {errorMessage && errorMessage.length > 0 &&
                    <IonText color="danger">{errorMessage}</IonText>
                }
                <IonLoading isOpen={loading}/>
            </IonContent>
        </IonPage>
    );
};

export default RegisterPage;

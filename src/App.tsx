import {IonApp, IonLoading, IonRouterOutlet,} from '@ionic/react';
import React from 'react';
import {IonReactRouter} from "@ionic/react-router";
import {Redirect, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AppTabs from "./AppTabs";
import {AuthContext, useAuthInit} from "./auth";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";

const App: React.FC = () => {
    const authState = useAuthInit();

    if (authState.loading) {
        return <IonLoading isOpen/>
    }

    return (
        <IonApp>
            <AuthContext.Provider value={authState.auth}>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route exact path="/login">
                            <LoginPage/>
                        </Route>
                        <Route exact path="/register">
                            <RegisterPage/>
                        </Route>
                        <Route path="/my">
                            <AppTabs/>
                        </Route>
                        <Redirect exact path="/" to="/my/entries"/>
                        <Route>
                            <NotFoundPage/>
                        </Route>
                    </IonRouterOutlet>
                </IonReactRouter>
            </AuthContext.Provider>
        </IonApp>
    );
};

export default App;

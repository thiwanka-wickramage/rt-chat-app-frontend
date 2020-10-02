import React, {useState} from "react";
import ChatPage from "./pages/chat.page";
import SignIn from "./pages/signin.page";
import SignUp from "./pages/signup.page";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import RootPage from "./pages/root.page";
import axiosHelper from "./helpers/axio.helper";
import commonHelper from "./helpers/common.helper"

const App = () => {
    const [username, setUsername] = useState('')
    const setupSocket = () => {
        //SocketClient.getInstance().connect();
    };

    const getLoggedUser = async () => {
        const user = await axiosHelper.GET('http://localhost:8080/api/user/'+commonHelper.getLoggedUserId());
        const { firstName, lastName } = user.data;
        setUsername(`${firstName} ${lastName}`)
    };


    React.useEffect(() => {
        setupSocket();

        (async ()=> {
            await getLoggedUser();
        })();
    }, []);

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={RootPage} exact/>
                <Route path="/signin" render={() => <SignIn setupSocket={setupSocket}/>} exact/>
                <Route path="/signup" component={SignUp} exact/>
                <Route path="/chat" render={() => <ChatPage username={username} />} exact/>
            </Switch>
        </BrowserRouter>
    )
};

export default (App);

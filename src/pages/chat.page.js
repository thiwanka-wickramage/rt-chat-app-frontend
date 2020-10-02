import React, {useState} from "react";
import axios from "axios";

import {Card, Grid} from "@material-ui/core";
import LeftContainer from "../containers/LeftContainer"
import RightContainer from "../containers/RightContainer"
import makeStyles from "@material-ui/core/styles/makeStyles";

import SocketClient from '../middlewares/webSocket'

import axiosHelper from "../helpers/axio.helper";


const useStyles = makeStyles(() => ({
    root: {
        padding: "50px 100px",
        zIndex: 999,
        position: "absolute"
    },
    card: {
        display: "flex",
        height: "calc(100vh - 100px)"
    },
    background: {
        position: "absolute",
        height: 200,
        width: "100%",
        top: 0,
        background: "#7159C1"
    }
}));

const ChatPage = (props) => {
    const socketClient = SocketClient.getInstance()

    const classes = useStyles();
    let [thread, setThread] = useState([]);
    let [conversation, setConversation] = useState([]);
    let [onlineUsers, setOnlineUsers] = useState([]);
    let [onlineUser, setOnlineUser] = useState(null);
    let [isUserChange, setUserChange] = useState(false);

    let [conversationData, setConversationData] = useState({
        conversationId: null,
        threadId: null
    });
    const [hasSocketInitialized, initializeSocket] = useState(false)

    const getUserConversations = async () => {
        try {
            const res = await axiosHelper.GET('http://localhost:8080/api/conversation');
            setConversation(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const getOnlineUsers = async () => {
        try {
            const res = await axiosHelper.GET('http://localhost:8080/api/users');
            setOnlineUsers(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const openThread = async (threadId, conversationId, user, isRead = false) => {
        setConversationData({threadId, conversationId, user});
        try {
            const thread = await axios.get(`http://localhost:8080/api/thread/${conversationId}/${threadId}`, {
                params: {isRead},
                headers: {Authorization: `${localStorage.getItem("WC_Token")}`}
            });
            setThread(thread.data.messages);
        } catch (e) {
            console.log(e);
        }

    };

    const updateConversationId = async (conversationId, threadId) => {
        setConversationData({conversationId, threadId});
    };

    const createConversation = async (userId, firstName, lastName) => {
        onlineUser = {userId, firstName, lastName};
        setOnlineUser(onlineUser);
        setThread([])
    };


    React.useEffect(() => {
        const { socket } = socketClient

        if (socket && !hasSocketInitialized) {
            initializeSocket(socket)

            socket.on('GET /live/incoming-message', async (data) => {
                await  getUserConversations();
                await getOnlineUsers();


                setThread(prevMessages => {
                    return [...prevMessages, { ...data.messages, conversationId: data.conversationId }]
                })
            });

            socket.on('GET /live/global-news', (data) => {
                setUserChange(data.userId.concat(Math.random()));
            })
        }

        if (!socket) {
            socketClient.connect()
        }

        return () => {
        }
    });

    React.useEffect(() => {
        (async () => {
            await getUserConversations();
            await getOnlineUsers();
        })();
    }, [isUserChange,conversationData]);

    React.useEffect(() => {
        return () => {
            const { socket } = socketClient

            if (!socket) {
                socketClient.disconnect()
            }
        }
    }, [])

    return (
        <div>
            <div className={classes.background}/>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Card className={classes.card}>
                        <Grid container>
                            <LeftContainer conversation={conversation} username={props.username}
                                           onlineUsers={onlineUsers} createConversation={createConversation}
                                           openThread={openThread}/>
                            <RightContainer onlineUser={onlineUser} updateConversationId={updateConversationId}
                                            thread={thread} conversationData={conversationData}/>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ChatPage;
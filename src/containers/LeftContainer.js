import {Avatar, CardHeader, Grid, List, ListItem, ListItemText} from "@material-ui/core";
import React, {useState} from "react";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import makeStyles from "@material-ui/core/styles/makeStyles";
import commonHelper from "../helpers/common.helper";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {withRouter} from "react-router-dom";

import axiosHelper from "../helpers/axio.helper";
import SocketClient from '../middlewares/webSocket'

const useStyles = makeStyles(() => ({
    rightBorder: {
        borderRight: "solid #d0D0D0 1px"
    },
    paper: {
        background: "#9de1fe",
        padding: 20
    },
    information: {
        color: "#444"
    },
    chatListItem: {
        borderRight: '1px solid #cacaca',
        borderBottom: '1px solid #d4d4d4',
        backgroundColor: '#ececec',
        cursor: 'pointer'
    },
    unread: {
        position: 'absolute',
        backgroundColor: '#f12323',
        borderRadius: 5,
        top: 2,
        color: '#FFF',
        fontSize: 12,
        padding: 2,
        right: 4
    },
    active: {
        borderRight: '1px solid #cacaca',
        backgroundColor: '#ffffff'
    },
    h4: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 500,
        color: '#777777',
        padding: 12,
        marginBottom:0
    },
    scroll : {
        height: '76vh',
        overflow: 'auto',
    },
    online: {
        position: 'absolute',
        backgroundColor: '#2ad066',
        borderRadius: 5,
        bottom: 6,
        color: '#FFF',
        fontSize: 10,
        padding: 2,
        right: 4,
        letterSpacing:2
    },
}));


const list = [

    {id: 2, name: "Robson", text: "Lorem ipsum", image: <WorkIcon/>},
    {id: 3, name: "Cleiton", text: "Lorem ipsum", image: <BeachAccessIcon/>}
];

const LeftContainer = (props) => {
    const {conversation, username, onlineUsers, createConversation} = props;
    const classes = useStyles();
    let [activeId, setActiveId] = useState(null);

    const handleClick = (threadId, conversationId, user, isRead) => {
        setActiveId(conversationId);
        props.openThread(threadId, conversationId, user, isRead ? true : false);
    };

    const handleClickOnlineUser = (userId, firstName, lastName) => {
        setActiveId(userId);
        createConversation(userId, firstName,lastName);
    };
    const logoutHandler = async () => {
        const socketId = SocketClient.getInstance().socket.id;
        await axiosHelper.POST('http://localhost:8080/api/auth/logOut',{socketId});
        localStorage.clear();
        props.history.push("/signin");

    }

    return (
        <Grid style={{backgroundColor: '#e2e2e2'}} item xs={3}>
            <CardHeader
                className={classes.rightBorder}
                avatar={
                    <Avatar aria-label="Recipe">

                    </Avatar>
                }
                title={username}
                action={
                    <div>
                        <IconButton aria-label="settings">
                            <ExitToAppIcon  onClick={logoutHandler}/>
                        </IconButton>
                    </div>
                }
            />

            <div className={classes.scroll}>
            <h4 className={classes.h4} style={{borderBottom:'2px solid #d0d0d0'}}>My Conversations</h4>
            <List>
                {conversation.map((item) => {
                    const user = item.createdUser._id.toString() === commonHelper.getLoggedUserId() ? item.recipient  : item.createdUser;
                    const unreadClass = item.notSeenUserId && item.notSeenUserId === commonHelper.getLoggedUserId() ? classes.unread : null;
                    return (
                        <ListItem className={`${classes.chatListItem} ${activeId === item._id ? classes.active : ''}`}
                                  key={item._id}
                                  onClick={() => handleClick(item.threadId, item._id, user, unreadClass)}>

                            <Avatar style={{marginRight:'5px'}}> {user.firstName.charAt(0).toLocaleUpperCase()} </Avatar>

                            <ListItemText primary={` ${user.firstName} ${user.lastName}`} />

                            {activeId !== item._id && unreadClass ? <div className={unreadClass}>Unread Message</div> : ''}
                            {item.isOnline ? <div className={classes.online}> ONLINE </div> : <div style={{backgroundColor:"#808080"}} className={classes.online}> OFFLINE </div>}
                        </ListItem>
                    )
                })}
            </List>
            <h4 className={classes.h4} style={{borderBottom:'2px solid #d0d0d0'}} >Online Users</h4>
            <List >
                {onlineUsers.map((item) => {
                    if(item._id === commonHelper.getLoggedUserId()) return;
                    return (
                        <ListItem className={`${classes.chatListItem} ${activeId === item._id ? classes.active : ''}`}
                                  key={item._id}
                                  onClick={() => handleClickOnlineUser(item._id, item.firstName, item.lastName )}>

                            <Avatar style={{marginRight:'5px'}}> {item.firstName.charAt(0).toLocaleUpperCase()} </Avatar>

                            <ListItemText primary={` ${item.firstName} ${item.lastName}`} />
                            {item.isOnline ? <div className={classes.online}> ONLINE </div> : <div style={{backgroundColor:"#808080"}} className={classes.online}> OFFLINE </div>}
                        </ListItem>
                    )
                })}
            </List>
            </div>
        </Grid>
    )
};

export default withRouter(LeftContainer);
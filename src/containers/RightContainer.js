import {Avatar, CardContent, CardHeader, Grid, IconButton} from "@material-ui/core";
import ImageIcon from "@material-ui/core/SvgIcon/SvgIcon";
import React, {useState} from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";
import axioHelper from "../helpers/axio.helper"
import commonHelper from "../helpers/common.helper"
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
    content: {
        marginTop: 0,
        height: "calc(100vh - 100px)",
        marginBottom: 20
    },
    rightContainer: {
        backgroundColor: '#efefef',
        overflow: 'auto'
    },
    heightAdjust: {
        display: "flex",
        flexDirection: "column"
    },
    chatWrapper: {
        overflow: "auto"
    },
    chatBubble: {
        border: ' 1px solid #b1a0ea',
        padding: 7,
        borderRadius: 7,
        width: 'fit-content',
        backgroundColor: '#dddbff;',
        marginBottom: 5,
        fontSize: 14,
        float: "left"
    },
    myBubble: {
        float: "right",
        border: ' 1px solid #d8d6d6;',
        backgroundColor: '#ffffff;;',
    }
}));


const RightContainer = (props) => {
    const {thread, conversationData, updateConversationId, onlineUser = null} = props;
    const {conversationId, threadId, user} = conversationData;
    const classes = useStyles();

    let [message, setMessage] = useState('');
    let [updatedThread, setThread] = useState([]);
 //   let [activeUser, updateOnlineUser] = useState([]);

    const activeUser = !user ? onlineUser : user;
    const handleChange = (e) => {
        message = e.target.value;
        setMessage(message);
    };
    const sendMessageHandler = async (e) => {
        try {
            e.preventDefault();
            if(!message.trim().length) return;
            updatedThread.push({content: message, userId: null});
            updatedThread = [...updatedThread];
            setThread(updatedThread);
            if (conversationId) {
                await axioHelper.POST('http://localhost:8080/api/thread', {conversationId, threadId, content: message});
            } else {
                const res = await axioHelper.POST('http://localhost:8080/api/conversation', {
                    recipientId: onlineUser.userId,
                    content: message
                });
                const { conversationId, threadId } = res.data;
                updateConversationId(conversationId, threadId);
            }
            setMessage('');
        } catch (e) {
            console.log(e)
        }

    };

    React.useEffect(() => {
        setThread(thread);
    }, [thread])


    if (!activeUser)
        return (
            <Grid style={{backgroundColor: '#efefef'}} className={classes.heightAdjust} item xs={9}>
            </Grid>
        );

    return (
        <Grid className={classes.heightAdjust} item xs={9}>
            <CardHeader
                avatar={
                    <Avatar aria-label="Recipe" className={classes.avatar}>
                        <ImageIcon/>
                    </Avatar>
                }
                action={
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={`${activeUser.firstName} ${activeUser.lastName}`}
            />
            <CardContent className={`${classes.rightContainer} ${classes.content}`}>
                {updatedThread
                    .filter(item => !item.conversationId || item.conversationId === conversationId)
                    .map((item, key) => {
                    const isOwned = item.userId === commonHelper.getLoggedUserId() || !item.userId;
                    return (
                        <div className={classes.chatWrapper} key={key}>
                            {
                                isOwned ?
                                    <div className={`${classes.chatBubble} ${classes.myBubble} `}>
                                        <b>Me: </b> {item.content}
                                    </div> :
                                    <div className={classes.chatBubble}>
                                        <b>{activeUser.firstName}:</b> {item.content}
                                    </div>
                            }
                        </div>
                    )
                })}
                <div style={{paddingBottom: '100px', paddingTop: '15px'}}>
                    <hr/>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Paper className={classes.paper}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="message"
                                label="Message"
                                name="message"
                                onChange={handleChange}
                                value={message}
                            />
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper className={classes.paper}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={sendMessageHandler}
                                    type="submit"
                                    style={{height:'55px'}}
                                >
                                    Send
                                </Button>
                            </Paper>
                        </Grid>
                        </Grid>
                    </form>
                </div>
            </CardContent>
        </Grid>
    )
};

export default (RightContainer);
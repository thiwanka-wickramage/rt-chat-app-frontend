import React from "react";

const RootPage = (props) => {
    React.useEffect(() => {
        const token = localStorage.getItem("WC_Token");
        if (!token) {
            props.history.push("/signin");
        } else {
            props.history.push("/chat");
        }
    }, [0]);
    return <div></div>;
};

export default RootPage;
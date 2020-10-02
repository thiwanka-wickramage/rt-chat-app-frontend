const commonHelper = {
    getLoggedUserId : () => (localStorage.getItem("WC_UserId")),
    getLoggedUserToken : () => (localStorage.getItem("WC_Token")),
};

export default commonHelper;
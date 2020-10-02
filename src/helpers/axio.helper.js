import axios from "axios/index";
import commonHelper from "../helpers/common.helper";

const axioHelper = {
    GET : async (url) => {
        const TOKEN = commonHelper.getLoggedUserToken();

        return axios.get(url, {
            headers: { Authorization: `${TOKEN}` }
        });
    },
    POST : async (url, data) => {
        const TOKEN = commonHelper.getLoggedUserToken();
        return axios.post(url, data,{
            headers: { Authorization: `${TOKEN}` }
        });
    }

}


export default axioHelper;
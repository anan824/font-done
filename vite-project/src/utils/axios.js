import security from "./security.es6";
import axios from 'axios'
// rely onaxios
if (!axios) throw new Error("need axios");

const api = axios.create({
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

const commonConfig = {
  headers: {},
  params: {},
  encrytoType: 0, // 0 No encryption 1 Asymmetric encryption 2 Symmetric encryption,
  key: "", //secret key,
  pKi: "",
};

api.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      ...commonConfig.headers,
    };

    config.data = {
      ...config.data,
      sensors_distinct_id:window.DISTINCT_ID?window.DISTINCT_ID:''
    }
    if (config.method == "post") {
      //If it isformData
      if (Object.prototype.toString.call(config.data) == "[object FormData]") {
        // config.headers['Content-Type'] = 'multipart/form-data;'; //No need to change the head axiosInternal judgment If it isformData Automatic removalcontentType Let the browser set itself
        // Add public parameters
        Object.keys(commonConfig["params"]).forEach((key) => {
          config.data.append(key, commonConfig["params"][key]);
        });
      } else {
        let data = {
          ...commonConfig["params"],
          ...config.data,
          access_time: Math.floor(new Date() / 1000),
        };
        // encryption
        data = security.encryptJson(
          data,
          commonConfig.encrytoType,
          commonConfig.encrytoType == 2 ? commonConfig.key : commonConfig.pKi
        );
        config.data = Object.keys(data)
          .map((k) => {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
          })
          .join("&");
        config.headers["Content-Type"] =
          "application/x-www-form-urlencoded; charset=UTF-8";
      }
    } else {
      let params = {
        ...commonConfig["params"],
        ...config.params,
        access_time: Math.floor(new Date() / 1000),
      };
      // encryption
      config.params = security.encryptJson(
        params,
        commonConfig.encrytoType,
        commonConfig.encrytoType == 2 ? commonConfig.key : commonConfig.pKi
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//returndata
api.interceptors.response.use(
  (response) => {
    let ret = response.data;
    if (commonConfig.encrytoType == 1 || commonConfig.encrytoType == 2) {
      try {
        ret = JSON.parse(
          security.symmetricDecrypt(response.data, commonConfig.key)
        );
      } catch (e) {
        ret = response.data;
      }
    }
    return {
      ...ret,
      _config: response.config,
    };
    // if(typeof(response.data)=='string'){
    //     return {
    //         retData:response.data,
    //         _config: response.config
    //     }
    // } else {
    //     return {
    //         ...response.data,
    //         _config: response.config
    //     }
    // }
  },
  (error) => Promise.reject(error)
);

export default api;

export const setCommonConfig = (key, value) => {
  if (key in commonConfig) {
    commonConfig[key] = value;
  }
};

export const setCommonParams = (key, value) => {
  commonConfig["params"][key] = value;
};

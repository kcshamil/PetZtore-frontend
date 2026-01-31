import axios from "axios";

const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
  };

  try {
    const result = await axios(reqConfig);
    return result;
  } catch (err) {
    return err.response || { status: 500, data: { message: "Network error" } };
  }
};

export default commonAPI;
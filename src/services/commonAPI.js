import axios from "axios";

const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: {
      "Content-Type": "application/json",
      ...reqHeader
    }
  };

  try {
    const result = await axios(reqConfig);
    return result;
  } catch (err) {
    console.error(`[API Error] ${httpMethod} ${url}:`, {
      status: err.response?.status,
      message: err.response?.data?.message || err.message
    });
    throw err;
  }
};

export default commonAPI;
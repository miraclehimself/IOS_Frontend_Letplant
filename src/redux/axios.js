import axios from "axios";

export const AxiosCall = async ({ path, method, data, token }, config) => {
  try {
    const response = await axios({
      url: path,
      method,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      ...config, // Spread the provided config object
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

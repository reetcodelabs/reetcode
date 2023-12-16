import Axios from "axios";

export const axiosClient = Axios.create({
  baseURL: "/api",
});

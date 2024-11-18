import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const processText = (text) => {
  return api.post("/token/process", { text });
};

export const downloadPDF = (fileName) => {
  return api.get(`/token/download/${fileName}`, { responseType: "blob" });
};

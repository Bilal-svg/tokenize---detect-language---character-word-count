import React, { useState } from "react";
import axios from "axios";
import styles from "./TextProcessor.module.css";
import Button from "../Button";
import * as path from "path";

const TextProcessor = () => {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");

  const handleProcessText = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post("http://localhost:3000/token/process", {
        text,
      });
      const { filePath } = response.data;
      setPdfFileName(filePath.split("\\").pop());
      alert("Text processed successfully!");
    } catch (error) {
      alert("Error processing text");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfFileName) {
      alert("No file to download");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/token/download/${pdfFileName}`,
        {
          responseType: "blob", // Expect binary data
        }
      );

      console.log("Response Headers:", response.headers);
      console.log("Response Data Type:", response.data.type);

      // Validate Content-Type
      if (response.headers["content-type"] !== "application/pdf") {
        alert("Error: File is not a valid PDF");
        return;
      }

      // Create a link to download the file
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", pdfFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Error downloading the file");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Text Processor</h2>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="5"
        cols="50"
        placeholder="Enter text to process..."
      />
      <div>
        <Button onClick={handleProcessText} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Process Text"}
        </Button>
      </div>
      <div>
        <Button onClick={handleDownloadPDF} disabled={!pdfFileName}>
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default TextProcessor;

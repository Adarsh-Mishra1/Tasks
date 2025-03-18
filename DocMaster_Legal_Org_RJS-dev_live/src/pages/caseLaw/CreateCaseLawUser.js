import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import userStore from "../../zustand/userStore";
import { apiKeyHeader,apiKeyHeaderMultiPartFormData } from "../../configs/ApiKeys";
import { WsPutCaseLaw, WsFileUpload } from "../../configs/WebService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateCaseLawUser({ handleStage }) {
  const userData1 = userStore((state) => state.user);
 // console.log("userData_", userData1.id);
  const userData = userStore();
  const [caseUid, setCaseUid] = useState("");
  const [judgementDate, setJudgementDate] = useState("");
  const [headnote, setHeadnote] = useState("");
  const [courtJudgment, setCourtJudgment] = useState("");
  const [caseOutcome, setCaseOutcome] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiResult, setApiResult] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  

  
  const uploadFile = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return null;
    }

    const formData = new FormData();
    formData.append("file2upload", selectedFile);
    formData.append("userId", 3185);
    formData.append("label", "file");

    try {
      const response = await fetch(WsFileUpload, {
        method: "POST",
        headers: {
          "docmaster-apikey": "abcdef12345",
        },
        body: formData,
      });

      const responseBody = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseBody);
        console.log("File upload response:", data);
        toast.success("File uploaded successfully!");
       console.log(data.data);
        //setApiResult(data.data);
        return data; // Return the uploaded file data if needed
      } else {
        const errorData = JSON.parse(responseBody);
        console.error("File upload failed:", response.statusText, errorData);
        toast.error("Error uploading file!");
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file!");
      return null;
    }
  };
  
  
  
  
  
  

  const submitPutCaseLaw = async (e) => {
    e.preventDefault();
  
    let uploadedFile = null;
    try {
      // Try uploading the file
      uploadedFile = await uploadFile();
      // If file upload is successful, store the result in the state
      if (uploadedFile) {
        setApiResult(uploadedFile.data || null);
      }
    } catch (error) {
      // If file upload fails, handle the error and proceed
      console.error("File upload failed:", error);
      setApiResult(null); // Set apiResult to null if file upload fails
    }
  
    // Proceed with form submission, whether the file was uploaded or not
    const payload = {
      userId: userData.user.id,
      caseUid,
      judgementDate,
      headnote,
      courtJudgment,
      caseOutcome,
      fileUploadLocation: uploadedFile ? uploadedFile.data : null, // Use uploadedFile data or null
    };
  
    try {
      const toastLoader = toast.success("Submitting case law...");
  
      const response = await fetch(WsPutCaseLaw, {
        method: "POST",
        headers: apiKeyHeader(),
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.resultCode === 1) {
          toast.dismiss(toastLoader);
          handleStage(1); // Proceed to the next stage
        }
      } else {
        console.error("Error:", response.statusText);
        toast.error("Error submitting case law data!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting case law data!");
    }
  };
  

  return (
    <Form onSubmit={submitPutCaseLaw} method="post">
      <FormGroup className="mb-3" row>
        <Label sm={2}>Case Law</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="caseLawUid"
            id="caseUid"
            placeholder="Ram Singh vs Shyam Singh"
            minLength={4}
            maxLength={100}
            required
            value={caseUid}
            onChange={(e) => setCaseUid(e.target.value)}
          />
        </Col>
      </FormGroup>

      <FormGroup className="mb-3" row>
        <Label sm={2}>Judgement Date</Label>
        <Col sm={10}>
          <Input
            type="date"
            name="judgementDate"
            id="judgementDate"
            placeholder="Judgement Date"
            required
            value={judgementDate}
            onChange={(e) => setJudgementDate(e.target.value)}
          />
        </Col>
      </FormGroup>

      <FormGroup className="mb-3" row>
        <Label sm={2}>Head Note</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="headnote"
            id="headnote"
            placeholder="Brief note about the above judgement"
            minLength={5}
            maxLength={400}
            required
            value={headnote}
            onChange={(e) => setHeadnote(e.target.value)}
          />
        </Col>
      </FormGroup>

      <FormGroup className="mb-3" row>
        <Label sm={2}>Judgement</Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="courtJudgment"
            id="courtJudgment"
            placeholder="Detailed Judgement"
            minLength={2}
            maxLength={2000}
            required
            value={courtJudgment}
            onChange={(e) => setCourtJudgment(e.target.value)}
          />
        </Col>
      </FormGroup>

      <FormGroup className="mb-3" row>
        <Label sm={2}>Case Outcome</Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="caseOutcome"
            id="caseOutcome"
            placeholder="Final result or relief"
            minLength={2}
            maxLength={1000}
            required
            value={caseOutcome}
            onChange={(e) => setCaseOutcome(e.target.value)}
          />
        </Col>
      </FormGroup>

      {/* File Upload Form Group */}
      <FormGroup className="mb-3" row>
          <Label sm={2}>Upload File</Label>
          <Col sm={10}>
            <Input
              type="file"
              name="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </Col>
        </FormGroup>

      <div className="text-center">
        <button className="btn btn-sm btn-primary"
          style={{
            fontSize: "14px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={submitPutCaseLaw}
        >
          Submit
        </button>
      </div>
    </Form>
  );
}

export default CreateCaseLawUser;

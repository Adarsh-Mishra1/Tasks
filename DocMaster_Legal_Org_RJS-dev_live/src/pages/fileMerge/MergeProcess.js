import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, FormGroup, Label, Input, Col } from "reactstrap";
import axios from "axios";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userStore from "../../zustand/userStore";
import {
  WsGetFileMergeTemplate,
  WsGetFilesForMerge,
  WsPutFileMergeUserRecord,
  WsPutFileForMerge,
  WsMergeFilesAsPerSequence,
  WsRemoveFileForMerge,
  WsMergeFilesAsPerSequence2,
  WSAddPageNumberToMergeFile,
} from "../../configs/WebService";
import {
  apiKeyHeader,
  apiKeyHeaderMultiPartFormData,
} from "../../configs/ApiKeys";
import { Height } from "@mui/icons-material";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const MergeProcess = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);
  const location = useLocation();

  const userMergeData = location.state?.userMergeData;
  const mergeTemplate =
    userMergeData != undefined
      ? userMergeData.fileMergeTemplate
      : location.state.mergeTemplate;

  const [fileMergeTemplate, setFileMergeTemplate] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedFileRecords, setUploadedFileRecords] = useState([]);
  const [hideCreateButton, setHideCreateButton] = useState(
    userMergeData?.id > 0 ? true : false
  );
  const [hideMergeButton, setHideMergeButton] = useState(
    userMergeData?.id > 0 ? false : true
  );
  const [showFinalMergedFile, setShowFinalMergedFile] = useState(
    userMergeData?.id > 0 ? true : false
  );

  const [title, setTitle] = useState(userMergeData ? userMergeData.title : "");
  const [recordId, setRecordId] = useState(
    userMergeData ? userMergeData.id : null
  );
  const [headerData, setHeaderData] = useState("");
  // const [array, setMyArray] = useState([]);
  // const [formData, setFormData] = useState({
  //   courtname: "",
  //   location: "",
  //   state: "",
  //   complaintnumber: "",
  //   complainant: "",
  //   accused: "",
  //   advocate: "",
  //   date: "",
  // });
  const formatDate1 = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [array1, setMyArray] = useState([]);

  const array = userMergeData != undefined && userMergeData.formData != undefined ? userMergeData.formData.split(',').map((item) => item.trim()) : null; // Split by comma and trim whitespace
  // setMyArray([...values]); // Add values to the array

  const [formData, setFormData] = useState({
    courtname: array != null && array.length > 0 ? array.slice(0, 1) : "",
    location: array != null && array.length > 1 ? array.slice(1, 2) : "",
    state: array != null && array.length > 2 ? array.slice(2, 3) : "",
    complaintnumber: array != null && array.length > 3 ? array.slice(3, 4) : "",
    complainant: array != null && array.length > 4 ? array.slice(4, 5) : "",
    accused: array != null && array.length > 5 ? array.slice(5, 6) : "",
    advocate: array != null && array.length > 6 ? array.slice(6, 7) : "",
    date: array != null && array.length > 7 ? formatDate1(array.slice(7, 8)) : "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const toggleForm = () => {
    setIsDisabled((prev) => !prev);
  };

  useEffect(() => {
    if (userData != null && userData.isLoggedIn) {
      getFileMergeTemplates();
      if (userMergeData != undefined && userMergeData.id > 0) {

        console.log(array, "bcjb");
        getFilesForMerge();
      }
    } else {
      window.location.href = "/";
    }
  }, []);
  //added by ghufran 7/3/2025
  useEffect(() => {
    const alreadyExist = getRecordToUploadedFileRecords(0, 1);
    if (alreadyExist != null && showFinalMergedFile) {
      setIsDisabled(true); 
    } else {
      setIsDisabled(false); // Enable when the section does not show
    }
  }, [uploadedFileRecords, showFinalMergedFile]);

  const getFileMergeTemplates = () => {
    axios
      .get(`${WsGetFileMergeTemplate}/${userData.id}/${mergeTemplate.id}`, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.result_code === 1) {
          setFileMergeTemplate(
            responseData.result_message.sort((a, b) => a.sequence - b.sequence)
          );
          setErrorMsg("");
        } else {
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const getFilesForMerge = () => {
    axios
      .get(
        `${WsGetFilesForMerge}/${userData.id}/${userData.org.id}/${recordId}`,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        console.log("hi")
        console.log(response)
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setUploadedFileRecords(
            processFileRecords(
              responseData.resultMessage,
              responseData.serverURL
            )
          );
          setHideCreateButton(true);
          setErrorMsg("");
        } else {
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const processFileRecords = (fileMergeRecords, serverURL) => {
    fileMergeRecords.map((fileMergeRecord) => {
      fileMergeRecord[
        "fileURL"
      ] = `${serverURL}/${userData.org.id}/${userData.id}/${fileMergeRecord.id}`;
    });
    return fileMergeRecords;
  };

  const handleChange = (e) => {
    console.log("Field changed:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Function to format the date in DD-MM-YYYY format
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };


  // onSubmitHandler function
  const onSubmitHandler = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Destructure the necessary fields from formData
    const {
      courtname,
      location,
      state,
      complaintnumber,
      complainant,
      accused,
      advocate,
      date,
    } = formData;
    console.log("output", formData);
    // Format the date
    const formattedDate = date ? formatDate(date) : "";

    // Validate the title length
    if (title.length <= 2) {
      alert("Provide a Valid title");
      return; // Exit the function if the title is invalid
    }

    // Create a header data string if needed
    const dataString = `${courtname}, ${location}, ${state}, ${complaintnumber}, ${complainant}, ${accused}, ${advocate}, ${formattedDate}`;
    setHeaderData(dataString); // Update the header data state

    // Call the function to submit the user record
    putFileMergeUserRecord(); // Call your function to handle further submission
  };
  function addPageNumber(inputpath) {
    let params2post = JSON.stringify({
      pdfUrl: inputpath,
      
    });
    axios
      .post(WSAddPageNumberToMergeFile, params2post, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.result_code === 1) {
        } else {
          alert(responseData.result_message);
          navigate(`/documentmanagments?5`);
         // setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("error", error);
        //setErrorMsg("Error while processing");
      });
  }
  function putFileMergeUserRecord() {
    axios
      .post(
        WsPutFileMergeUserRecord,
        JSON.stringify({
          userId: userData.id,
          orgId: userData.org.id,
          templateId: mergeTemplate.id,
          recordId: recordId,
          title: title,
          formData: formData,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setRecordId(Number(responseData.dataId));
          setHideCreateButton(true);
          setHideMergeButton(false);
          setErrorMsg("");
          navigate(`/documentmanagments?5`);
        } else {
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        setErrorMsg("Error while processing");
      });
  }

  function putFileMergeUserRecord1(encodedParagraph) {
    
    axios
      .post(
        WsPutFileMergeUserRecord,
        JSON.stringify({
          userId: userData.id,
          orgId: userData.org.id,
          templateId: mergeTemplate.id,
          recordId: recordId,
          title: title,
          formData: encodedParagraph,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setRecordId(Number(responseData.dataId));
          setHideCreateButton(true);
          setHideMergeButton(false);
          setErrorMsg("");
          navigate(`/documentmanagments?5`);
        } else {
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        setErrorMsg("Error while processing");
      });
  }

  function putFileMergeUserRecord() {
    // alert("enter this method")
    axios
      .post(
        WsPutFileMergeUserRecord,
        JSON.stringify({
          userId: userData.id,
          orgId: userData.org.id,
          templateId: mergeTemplate.id,
          recordId: recordId,
          title: title,
          formData: "",
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setRecordId(Number(responseData.dataId));
          setHideCreateButton(true);
          setHideMergeButton(false);
          setErrorMsg("");
          setIsDisabled(false)
        } else {
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        setErrorMsg("Error while processing");
      });
  }

  const processFileToUpload = (fileEvent, fileLabel, fileSequence) => {
    if (recordId <= 0) {
      alert(
        "First create a File Record by providing a title and submitting it"
      );
      fileEvent.target.value = null;
    } else {
      if (fileEvent.target.files[0].size > 1024 * 1024 * 100) {
        alert("File size cannot exceed more than 100MB");
        fileEvent.target.value = null;
      } else if(fileEvent.target.files[0].size==0)
        {
          alert("File size cannot be empty");
          fileEvent.target.value = null;
        }else {
        uploadFileForMergeProcess(recordId, fileEvent, fileLabel, fileSequence);
      }
    }
  };

  const uploadFileForMergeProcess = (
    recordId,
    fileEvent,
    fileLabel,
    fileSequence
  ) => {
    const formData2post = new FormData();
    formData2post.append("userId", userData.id);
    formData2post.append("orgId", userData.org.id);
    formData2post.append("recordId", recordId);
    formData2post.append("label", fileLabel);
    formData2post.append("sequence", fileSequence);

    for (const file of fileEvent.target.files) {
      formData2post.append("file2upload", file);
    }

    axios
      .post(WsPutFileForMerge, formData2post, {
        headers: apiKeyHeaderMultiPartFormData(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          addRecordToUploadedFileRecords(
            fileSequence,
            responseData.data,
            responseData.fileUrl,
            0
          );
          setErrorMsg("");
          
        } else {
          setErrorMsg(responseData.resultMessage);
          fileEvent.target.value = null;
        }
      })
      .catch((err) => {
        alert("File Upload Error");
        fileEvent.target.value = null;
      });
  };

  const addRecordToUploadedFileRecords = (sequence, file, fileUrl, isFinal) => {
    if (uploadedFileRecords.length > 0) {
      if (uploadedFileRecords.some((item) => item.sequence === sequence)) {
        uploadedFileRecords.forEach((obj) => {
          if (obj.sequence === sequence) {
            obj.fileURL = fileUrl;
            obj.isFinal = isFinal;
          }
        });
        setUploadedFileRecords([...uploadedFileRecords]);
      } else {
        setUploadedFileRecords([
          {
            sequence: Number(sequence),
            nameExt: file.nameExt,
            fileURL: fileUrl,
            isFinal: isFinal,
          },
          ...uploadedFileRecords,
        ]);
      }
    } else {
      setUploadedFileRecords([
        {
          sequence: Number(sequence),
          nameExt: file.nameExt,
          fileURL: fileUrl,
          isFinal: isFinal,
        },
      ]);
    }
  };

  const getRecordToUploadedFileRecords = (sequence, isFinal) => {
    if (uploadedFileRecords.length > 0) {
      const temp = uploadedFileRecords.filter(
        (fileRecObject) =>
          fileRecObject.sequence === sequence &&
          fileRecObject.isFinal === isFinal
      );
      return temp.length > 0 ? temp[0] : null;
    }
    return null;
  };

  const proceedToMergeFiles = () => {

    setHideMergeButton(true);
    toast.success("Merging Please Wait ...", { autoClose: 600 });
    console.log(headerData);
    console.log(formData, "hello");

    const formatDate1 = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
      const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if needed
      return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    };
    const formattedComplaintNumber = formData.complaintnumber ? String(formData.complaintnumber).replace(/\//g, '-') : '';
    const fcourtname = formData.courtname ? String(formData.courtname).replace(",", " ") : '';
    const headerData1 = `${fcourtname},${formData.location
      },${formData.state},${formattedComplaintNumber},${formData.complainant},${formData.accused
      },${formData.advocate},${formatDate1(formData.date)}`;

    var encodedParagraph = encodeURIComponent(headerData1);
    console.log(headerData1);
    console.log(encodedParagraph);
    putFileMergeUserRecord1(headerData1);

    /*.get(
  axios.get(`${WsMergeFilesAsPerSequence}/${userData.org.id}/${userData.id}/${recordId}/1/${encodedParagraph}`, { headers: apiKeyHeader() })
)*/
    axios
      .get(
        `${WsMergeFilesAsPerSequence2}/${userData.org.id}/${userData.id}/${recordId}/1/${encodedParagraph}`,
        // `${WsMergeFilesAsPerSequence}/${userData.org.id}/${userData.id}/${recordId}/1/${encodedParagraph}`,
        { headers: apiKeyHeader() }
      )

      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          addRecordToUploadedFileRecords(
            0,
            responseData.data,
            responseData.fileUrl,
            1
          );
          setShowFinalMergedFile(true);
          setErrorMsg("");
          console.log("sample", responseData.fileUrl);
         
          let mergeurl= responseData.fileUrl;
      
     if(mergeurl!=null)
     {
  
   addPageNumber(mergeurl);
     }
          goToMyMergedFile();
        } else {
          setErrorMsg(responseData.resultMessage);
          setHideMergeButton(false);
          setShowFinalMergedFile(false);
        }
      })
      .catch((error) => {
        setErrorMsg(error.message);
        setHideMergeButton(false);
        setShowFinalMergedFile(false);
      });
  };

  const goToMyMergedFile = () => {
   // window.location.reload();
  };

  const deleteThisFileForMerge = (fileForMerge) => {
    if (
      window.confirm(
        `Sure to delete this file '${fileForMerge.nameExt}' from Merge?`
      )
    ) {
      proceedToDeleteThisFileForMerge(fileForMerge);
    }
  };

  function proceedToDeleteThisFileForMerge(fileForMerge) {
    axios
      .post(
        WsRemoveFileForMerge,
        JSON.stringify({
          id: fileForMerge.id,
          recordId: recordId,
          userId: userData.id,
          orgId: userData.org.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          removeFileFromUploadedFileRecordsArray(fileForMerge);
        } else {
          toast.error(responseData.resultMessage, {
            position: "top-center",
            autoClose: 1800,
          });
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        setErrorMsg("Error while processing");
      });
  }
  console.log(fileMergeTemplate);
  const removeFileFromUploadedFileRecordsArray = (fileForMerge) => {
    setUploadedFileRecords(
      uploadedFileRecords.filter(
        (uploadedFileRecord) => uploadedFileRecord.id !== fileForMerge.id
      )
    );
  };
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault(); // Prevent default action (link navigation)
    }
  };
  return (
    <Suspense
      fallback={<>Loading...</>}
      style={{ Height: "100vh", overFlowY: "auto" }}
    >
      <div className="main_container">
        <Sidebar />
        <Navbar />
        <div className="right_col" role="main">
          <div className="tab-content" style={{ border: "0" }}>
            <div className="page-title">
              <div className="title_left">
                <h3>
                  Merge & Create Signle PDF for Online Filing &nbsp;
                  <span
                    style={{
                      fontSize: "16px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Go Back ⬅️
                  </span>
                </h3>
              </div>
            </div>

            <div className="clearfix"></div>

            <div className="row">
              <div className="col-md-12">
                {/* Error Message */}
                {errorMsg?.length > 0 ? <h4>*{errorMsg}</h4> : null}

                {/* File Merge Template */}
                {fileMergeTemplate.length >= 0 ? (
                  <>
                    <Form onSubmit={onSubmitHandler} method="POST">
                      {/* Title Input */}
                      <FormGroup className="mb-3" row>
                        <Label for="inputTitle" md={4} className="my-1">
                          Write a Name for the online file *
                        </Label>
                        <Col className="my-1" md={6}>
                          <Input
                            type="text"
                            className="form-control"
                            id="inputTitle"
                            name="title"
                            placeholder="Case of Ram Kumar vs Shyam Kumar"
                            value={title}
                            minLength="3"
                            maxLength="64"
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={hideCreateButton}
                            required
                          />
                        </Col>
                        <Col md={2}>
                          {!hideCreateButton && (
                            <button className="btn my-1 mx-0  btn-primary"
                              style={{
                                fontSize: "14px",
                                // color: "blue",
                                cursor: "pointer",
                              }}
                              onClick={onSubmitHandler}
                            >
                              Proceed
                            </button>
                            // <button type="submit" className="btn btn-info">
                            //   Proceed{" "}
                            //   <i
                            //     className="fa fa-arrow-right"
                            //     aria-hidden="true"
                            //   ></i>
                            // </button>
                          )}
                        </Col>
                      </FormGroup>
                    </Form>

                    {/* File Upload Section */}
                    {!hideMergeButton && (
                      <div
                        style={{
                          width: "100%",
                          border: "1px solid #eaeaea",
                          padding: "5px 10px",
                        }}
                      >
                        {/* Court-related Inputs */}
                        <FormGroup className="mb-3" row>
                          <Label for="courtname" sm={2}>
                            Court Name *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              id="courtname"
                              name="courtname"
                              placeholder="Court Name"
                              value={formData.courtname}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-3" row>
                          <Label for="location" sm={2}>
                            Location *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              id="location"
                              name="location"
                              placeholder="Location"
                              value={formData.location}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-3" row>
                          <Label for="state" sm={2}>
                            State *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              id="state"
                              name="state"
                              placeholder="State"
                              value={formData.state}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-3" row>
                          <Label for="complaintnumber" sm={2}>
                            Complaint Case Number *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              id="complaintnumber"
                              name="complaintnumber"
                              placeholder="Complaint Case Number"
                              value={formData.complaintnumber}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-3" row>
                          <Label for="complainant" sm={2}>
                            Complainant *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              id="complainant"
                              name="complainant"
                              placeholder="Complainant"
                              value={formData.complainant}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-3" row>
                          <Label for="accused" sm={2}>
                            Accused *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              id="accused"
                              name="accused"
                              placeholder="Accused"
                              value={formData.accused}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-3" row>
                          <Label for="advocate" sm={2}>
                            Name of Advocate *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="text"
                              id="advocate"
                              name="advocate"
                              placeholder="Name of Advocate"
                              value={formData.advocate}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-3" row>
                          <Label for="date" sm={2}>
                            Date *
                          </Label>
                          <Col sm={10}>
                            <Input
                              type="date"
                              id="date"
                              name="date"
                              placeholder="Date"
                              value={formData.date}
                              onChange={handleChange}
                              required
                              disabled={isDisabled}
                            />
                          </Col>
                        </FormGroup>
                        {/* File Upload Section */}
                        {fileMergeTemplate.length > 0 &&
                          fileMergeTemplate.map(
                            (fileMergeTemplateEle, index) => (
                              <FormGroup
                                className="mb-3"
                                row
                                key={
                                  fileMergeTemplateEle.sequence + "mainDivKey"
                                }
                              >
                                <Label
                                  for={
                                    index +
                                    "inputTitle" +
                                    fileMergeTemplateEle.sequence
                                  }
                                  md={2}
                                >
                                  {fileMergeTemplateEle.sequence}.{" "}
                                  {fileMergeTemplateEle.label} &nbsp;
                                  {fileMergeTemplateEle.tooltip && (
                                    <Tooltip
                                      placement="top"
                                      overlay={
                                        <span>
                                          {fileMergeTemplateEle.tooltip}
                                        </span>
                                      }
                                    >
                                      <i
                                        className="fa fa-info-circle"
                                        aria-hidden="true"
                                      ></i>
                                    </Tooltip>
                                  )}
                                </Label>

                                {/* File Input */}
                                <Col xs={9}>
                                  <Input
                                    type="file"
                                    disabled={isDisabled}
                                    name={fileMergeTemplateEle.label.replace(
                                      /\s/g,
                                      ""
                                    )}
                                    id={fileMergeTemplateEle.label.replace(
                                      /\s/g,
                                      ""
                                    )}
                                    placeholder={fileMergeTemplateEle.label}
                                    accept=".jpg,.pdf,.doc,.docx"
                                    multiple={
                                      fileMergeTemplateEle.isMultipleFiles
                                    }
                                    onChange={(e) =>
                                      processFileToUpload(
                                        e,
                                        fileMergeTemplateEle.label,
                                        fileMergeTemplateEle.sequence
                                      )
                                    }
                                    required
                                  />

                                </Col>

                                {/* View and Delete Uploaded Files */}
                                <Col className="text-end py-2" xs={3}>
                                  {(() => {
                                    let alreadyExist =
                                      getRecordToUploadedFileRecords(
                                        fileMergeTemplateEle.sequence,
                                        0
                                      );
                                    return alreadyExist != null ? (
                                      <>

                                        <a
                                          target="_blank"
                                          href={isDisabled ? '#' : alreadyExist.fileURL}
                                          rel="noreferrer"
                                          onClick={handleClick}
                                        >
                                          <i
                                            className={`fa fa-eye mx-2 ${isDisabled ? 'disabled-icon' : ''}`
                                            }
                                            title="View"
                                            style={{
                                              color: "blue",
                                              cursor: isDisabled ? 'not-allowed' : 'pointer'
                                            }}
                                          ></i>
                                        </a>
                                        <i

                                          className={`fa fa-trash mx-2 ${isDisabled ? 'disabled-icon' : ''}`}
                                          title="Delete"
                                          style={{
                                            color: "red",
                                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                                          }}
                                          onClick={isDisabled ? null : () => deleteThisFileForMerge(alreadyExist)}

                                        // onClick={() =>
                                        //   deleteThisFileForMerge(alreadyExist)
                                        // }
                                        ></i>

                                      </>
                                    ) : null;
                                  })()}
                                </Col>
                              </FormGroup>
                            )
                          )}

                        {/* Merge Button */}
                        {uploadedFileRecords.length==fileMergeTemplate.length && (
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={proceedToMergeFiles}
                          >
                            Merge
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : null}

                {/* Final Merged File */}
                {/* {add by ghufran 7/3/2025} */}
                {(() => {
                  const alreadyExist = getRecordToUploadedFileRecords(0, 1);

                  return (
                    <>
                      {alreadyExist != null && showFinalMergedFile ? (
                        <>
                          <br />
                          <h6>Merged File</h6>
                          <a
                            className="btn btn-primary mt-2"
                            target="_blank"
                            href={alreadyExist.fileURL}
                            rel="noreferrer"
                          >
                            <i
                              className="fa fa-eye mx-2"
                              title="View"
                              style={{ color: "white", cursor: "pointer" }}
                            ></i>
                            View
                          </a>
                          <button
                            className="btn btn-danger mt-2"
                            onClick={() => deleteThisFileForMerge(alreadyExist)}
                          >
                            <i
                              className="fa fa-trash mx-2"
                              title="Delete"
                              style={{ color: "white", cursor: "pointer" }}
                            ></i>
                            Delete
                          </button>
                          <button
                            className="btn btn-danger mt-2"
                            onClick={() => toggleForm()}
                          >
                            <i
                              className="fa fa-edit  mx-2"
                              title="Edit"
                              style={{ color: "white", cursor: "pointer" }}
                            ></i>
                            Edit
                          </button>
                        </>
                      ) : null}
                    </>
                  );
                })()}
                {/* {(() => {
                  let alreadyExist = getRecordToUploadedFileRecords(0, 1);
                  return alreadyExist != null && showFinalMergedFile ? (
                    <>
                      <br />
                      <h6>Merged File</h6>
                      <a
                        className="btn btn-primary mt-2"
                        target="_blank"
                        href={alreadyExist.fileURL}
                        rel="noreferrer"
                      >
                        <i
                          className="fa fa-eye mx-2"
                          title="View"
                          style={{ color: "white", cursor: "pointer" }}
                        ></i>
                        View
                      </a>
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => deleteThisFileForMerge(alreadyExist)}
                      >
                        <i
                          className="fa fa-trash mx-2"
                          title="Delete"
                          style={{ color: "white", cursor: "pointer" }}
                        ></i>
                        Delete
                      </button>
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => toggleForm()}
                      >
                        <i
                          className="fa fa-edit  mx-2"
                          title="Edit"
                          style={{ color: "white", cursor: "pointer" }}
                        ></i>
                        Edit
                      </button>
                    </>
                  ) : null;
                })()} */}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </Suspense>
  );
};

export default MergeProcess;

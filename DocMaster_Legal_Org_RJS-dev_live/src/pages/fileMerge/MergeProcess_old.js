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
} from "../../configs/WebService";
import {
  apiKeyHeader,
  apiKeyHeaderMultiPartFormData,
} from "../../configs/ApiKeys";

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
    userMergeData?.id > 0 ? true : false,
  );
  const [hideMergeButton, setHideMergeButton] = useState(
    userMergeData?.id > 0 ? false : true,
  );
  const [showFinalMergedFile, setShowFinalMergedFile] = useState(
    userMergeData?.id > 0 ? true : false,
  );

  const [title, setTitle] = useState(userMergeData ? userMergeData.title : "");
  const [recordId, setRecordId] = useState(
    userMergeData ? userMergeData.id : null,
  );
  const [headerData, setHeaderData] = useState('');

  const [formData, setFormData] = useState({
    courtname: "",
    location: "",
    state: "",
    complaintnumber: "",
    complainant: "",
    accused: "",
    advocate: "",
    date: "",
  });

  useEffect(() => {
    if (userData != null && userData.isLoggedIn) {
      getFileMergeTemplates();
      if (userMergeData != undefined && userMergeData.id > 0) {
        getFilesForMerge();
      }
    } else {
      window.location.href = "/";
    }
  }, []);

  const getFileMergeTemplates = () => {
    axios
      .get(
        `${WsGetFileMergeTemplate}/${userData.id}/${mergeTemplate.id}`,
        {
          headers: apiKeyHeader(),
        },
      )
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
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setUploadedFileRecords(
            processFileRecords(
              responseData.resultMessage,
              responseData.serverURL,
            ),
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
      fileMergeRecord["fileURL"] = `${serverURL}/${userData.org.id}/${userData.id}/${fileMergeRecord.id}`;
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
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

// onSubmitHandler function
const onSubmitHandler = (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Destructure the necessary fields from formData
  const { courtname, location, state, complaintnumber, complainant, accused, advocate, date } = formData;
  console.log("output",formData);
  // Format the date
  const formattedDate = date ? formatDate(date) : '';

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
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setRecordId(Number(responseData.dataId));
          setHideCreateButton(true);
          setHideMergeButton(false);
          setErrorMsg("");
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
      alert("First create a File Record by providing a title and submitting it");
      fileEvent.target.value = null;
    } else {
      if (fileEvent.target.files[0].size > 1024 * 1024 * 100) {
        alert("File size cannot exceed more than 100MB");
        fileEvent.target.value = null;
      } else {
        uploadFileForMergeProcess(recordId, fileEvent, fileLabel, fileSequence);
      }
    }
  };

  const uploadFileForMergeProcess = (recordId, fileEvent, fileLabel, fileSequence) => {
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
      if (uploadedFileRecords.some(item => item.sequence === sequence)) {
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
      const temp = uploadedFileRecords.filter(fileRecObject => (
        fileRecObject.sequence === sequence && fileRecObject.isFinal === isFinal
      ));
      return temp.length > 0 ? temp[0] : null;
    }
    return null;
  };

  const proceedToMergeFiles = () => {
    setHideMergeButton(true);
    toast.success("Merging Please Wait ...", { autoClose: 600 });
    console.log(headerData);
    console.log(formData);
    const headerData1 = `${formData.courtname.replace(',', ' ')},${formData.location} ,${formData.state},${formData.complaintnumber},${formData.complainant},${formData.accused},${formData.advocate},${formatDate(formData.date)}`;
    //var headerData = "LAXMIKANTH M.M TIS,HAZARI,DELHI,1234,SACHIN SHARMA,MAHESH VARMA,PYUSH SHARAMA,30-09-2024";
    var encodedParagraph = encodeURIComponent(headerData1);
    console.log(headerData1);

    console.log(encodedParagraph);
/*.get(
  axios.get(`${WsMergeFilesAsPerSequence}/${userData.org.id}/${userData.id}/${recordId}/1/${encodedParagraph}`, { headers: apiKeyHeader() })
)*/
axios.get(`${WsMergeFilesAsPerSequence}/${userData.org.id}/${userData.id}/${recordId}/1/${encodedParagraph}`, { headers: apiKeyHeader() })

      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          addRecordToUploadedFileRecords(0, responseData.data, responseData.fileUrl, 1);
          setShowFinalMergedFile(true);
          setErrorMsg("");
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
    window.location.reload();
  };

  const deleteThisFileForMerge = (fileForMerge) => {
    if (window.confirm(`Sure to delete this file '${fileForMerge.nameExt}' from Merge?`)) {
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
        },
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

  const removeFileFromUploadedFileRecordsArray = (fileForMerge) => {
    setUploadedFileRecords(
      uploadedFileRecords.filter(uploadedFileRecord => uploadedFileRecord.id !== fileForMerge.id)
    );
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Merge Process</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Template: {mergeTemplate.title}</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {/* Title Input for Merging Files */}
                  <FormGroup className="mb-3" row>
                      <Label for="inputTitle" sm={2}>
                        Title *
                      </Label>
                      <Col sm={6}>
                        <Input
                          type="text"
                          className="form-control"
                          id="inputTitle"
                          name="title"
                          placeholder="Title for Merged File"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          disabled={hideCreateButton}
                          required
                        />
                      </Col>
                      <Col sm={4}>
                        {!hideCreateButton && (
                          <button type="submit" className="btn btn-info">
                            Proceed <i className="fa fa-arrow-right" aria-hidden="true"></i>
                          </button>
                        )}
                      </Col>
                    </FormGroup>
                    <Form onSubmit={onSubmitHandler} method="POST">
  {/* Title Input */}
  <FormGroup className="mb-3" row>
    <Label for="inputTitle" sm={2}>
      Title *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        className="form-control"
        id="inputTitle"
        name="title"
        placeholder="Title for Merged File"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={hideCreateButton}
        required
      />
    </Col>
    <Col sm={4}>
      {!hideCreateButton && (
        <button type="submit" className="btn btn-info">
          Proceed <i className="fa fa-arrow-right" aria-hidden="true"></i>
        </button>
      )}
    </Col>
  </FormGroup>

  {/* Court-related Inputs */}
  <FormGroup className="mb-3" row>
    <Label for="courtname" sm={2}>
      Court Name *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        id="courtname"
        name="courtname"
        placeholder="Court Name"
        value={formData.courtname}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  <FormGroup className="mb-3" row>
    <Label for="location" sm={2}>
      Location *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        id="location"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  <FormGroup className="mb-3" row>
    <Label for="state" sm={2}>
      State *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        id="state"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  <FormGroup className="mb-3" row>
    <Label for="complaintnumber" sm={2}>
      Complaint Case Number *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        id="complaintnumber"
        name="complaintnumber"
        placeholder="Complaint Case Number"
        value={formData.complaintnumber}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  <FormGroup className="mb-3" row>
    <Label for="complainant" sm={2}>
      Complainant *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        id="complainant"
        name="complainant"
        placeholder="Complainant"
        value={formData.complainant}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  <FormGroup className="mb-3" row>
    <Label for="accused" sm={2}>
      Accused *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        id="accused"
        name="accused"
        placeholder="Accused"
        value={formData.accused}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  <FormGroup className="mb-3" row>
    <Label for="advocate" sm={2}>
      Name of Advocate *
    </Label>
    <Col sm={6}>
      <Input
        type="text"
        id="advocate"
        name="advocate"
        placeholder="Name of Advocate"
        value={formData.advocate}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  <FormGroup className="mb-3" row>
    <Label for="date" sm={2}>
      Date *
    </Label>
    <Col sm={6}>
      <Input
        type="date"
        id="date"
        name="date"
        placeholder="Date"
        value={formData.date}
        onChange={handleChange}
        required
      />
    </Col>
  </FormGroup>

  {/* File Upload Section */}
  {!hideMergeButton && (
    <div style={{ width: "100%", border: "1px solid #eaeaea", padding: "5px 10px" }}>
      {fileMergeTemplate.map((fileMergeTemplateEle) => (
        <FormGroup className="mb-3" key={fileMergeTemplateEle.sequence + "mainDivKey"} row>
          <Label sm={2}>
            {fileMergeTemplateEle.sequence}. {fileMergeTemplateEle.label} &nbsp;
            {fileMergeTemplateEle.tooltip && (
              <Tooltip placement="top" trigger={["hover"]} overlay={<span>{fileMergeTemplateEle.tooltip}</span>}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </Tooltip>
            )}
          </Label>
          <Col sm={4}>
            <Input
              type="file"
              name={fileMergeTemplateEle.label.replace(/\s/g, "")}
              placeholder={fileMergeTemplateEle.label}
              accept=".jpg,.pdf,.doc,.docx"
              multiple={fileMergeTemplateEle.isMultipleFiles}
              onChange={(e) => processFileToUpload(e, fileMergeTemplateEle.label, fileMergeTemplateEle.sequence)}
              required
            />
          </Col>
          <Col sm={4}>
            {getRecordToUploadedFileRecords(fileMergeTemplateEle.sequence, 0) && (
              <>
                <a target="_blank" href={getRecordToUploadedFileRecords(fileMergeTemplateEle.sequence, 0).fileURL}>
                  <i className="fa fa-eye mx-2" title="View" style={{ color: "blue", cursor: "pointer" }} />
                </a>
                <i
                  className="fa fa-trash mx-2"
                  title="Delete"
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => deleteThisFileForMerge(getRecordToUploadedFileRecords(fileMergeTemplateEle.sequence, 0))}
                />
              </>
            )}
          </Col>
        </FormGroup>
      ))}

      {uploadedFileRecords.length > 1 && (
        <button type="button" className="btn btn-success" onClick={proceedToMergeFiles}>
          Merge
        </button>
      )}
    </div>
  )}

  {/* Final Merged File Display */}
  {(() => {
    let alreadyExist = getRecordToUploadedFileRecords(0, 1);
    return alreadyExist != null && showFinalMergedFile ? (
      <>
        <br />
        <h6>Merged File</h6>
        <a className="btn btn-primary mt-2" target="_blank" href={alreadyExist.fileURL} rel="noreferrer">
          <i className="fa fa-eye mx-2" title="View" style={{ color: "white", cursor: "pointer" }} />
          View
        </a>
        <button className="btn btn-danger mt-2" onClick={() => deleteThisFileForMerge(alreadyExist)}>
          <i className="fa fa-trash mx-2" title="Delete" style={{ color: "white", cursor: "pointer" }} />
          Delete
        </button>
      </>
    ) : null;
  })()}
</Form>

                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </Suspense>
  );
};

export default MergeProcess;

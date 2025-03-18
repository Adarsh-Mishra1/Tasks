import { useEffect, useState, Suspense, lazy } from "react";
import { Form, useNavigate } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
  Col,
} from "reactstrap";

import axios from "axios";

import userStore from "../../zustand/userStore";
import { WsGetLegalGeneralDocForm } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  createSticktNote,
  fetchStickyNotes,
  fetchStickyNotesByUserIdJ,
} from "../../components/stickyNotes/stickyNotesApi";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const ClientCaseInfoDocFormsJQuery = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = userStore((state) => state.user);
  const [noteDetails, setNoteDetails] = useState("");
  const [displayCreateNote, setDisplayCreateNote] = useState(false);

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    // {
    //   Header: "Title",
    //   accessor: "nameTitle",
    // },
    {
      Header: "Title",
      accessor: "updatedTitle",
    },
    // {
    //   Header: "Action(s)",
    //   accessor: "actiontd",
    // },
  ];

  const [tableData, setTableData] = useState();

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getOrgClients();
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(function () {
    getNotes();
  }, []);

  const getOrgClients = async () => {
    // const localAPI = "http://localhost:8080/dm_leorg/getLegalGeneralDocForm";
    // const localAPI =
    //   "https://web1024.ipguide.net:8443/dm_leorg_test/getLegalGeneralDocForm";
    // https://web1024.ipguide.net:8443/dm_leorg_test/getLegalGeneralDocForm/26/3281/judgement

    await axios
      .get(
        WsGetLegalGeneralDocForm +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/judgement",
        {
          headers: apiKeyHeader(),
        }
      )
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          const publishedProblemInfo = await responseData.resultMessage.filter(
            (eachDoc) => {
              console.warn(eachDoc.docform);
              return eachDoc.docform.isJudgement === 1;
            }
          );
          setTableData(processLegalDocForms(publishedProblemInfo));
          // setTableData(processLegalDocForms(responseData.resultMessage));
        } else {
          if(!responseData.resultMessage === "No data found"){
          alert("Client Case Info DocForm(s): " + responseData.resultMessage);
        }
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processLegalDocForms = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      simpleData = simpleData.docform;
      simpleData["sno"] = index + 1;
      // simpleData["categoryTxt"] = simpleData.category?.category;
      simpleData["updatedTitle"] = (
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => goToClientCaseInfoDocFormFill(simpleData)}
        >
          {simpleData.nameTitle}
        </span>
      );
      // simpleData["actiontd"] = (
      //   <>
      //     <i
      //       className="fa fa-arrow-right mx-2"
      //       title="Start/Create"
      //       style={{ color: "blue", cursor: "pointer" }}
      //       aria-hidden="true"
      //       onClick={() => goToClientCaseInfoDocFormFill(simpleData)}
      //     />
      //   </>
      // );

      tempArrayVar.push(simpleData);
    });
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    return tempArrayVar;
  };

  const goToClientCaseInfoDocFormFill = (clientInfoLegalDocForm) => {
    // delete clientInfoLegalDocForm["actiontd"]; //Bug(If Not Using): Point To Be Notted
    delete clientInfoLegalDocForm["updatedTitle"]; //Bug(If Not Using): Point To Be Notted
    navigate("/clientCaseInfoDocFormFill", {
      state: {
        clientInfoLegalDocForm: clientInfoLegalDocForm,
        isJudgement: 1,
      },
    });
  };

  const getNotes = async () => {
    const loaderId = toast.success("Loading...", { autoClose: false });
    await dispatch(fetchStickyNotesByUserIdJ(userData.id));

    if (loaderId) {
      toast.update(loaderId, {
        render: "Loaded!",
        autoClose: 0,
      });
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (noteDetails.length > 0) {
      const body = {
        userId: userData.id,
        orgId: userData.org.id,
        caseId: "",
        noteTitle: "",
        noteData: noteDetails,
        createdAt: "judgement",
        noteAccess: "",
      };
      const addLoader = toast.success("Creating Note...", { autoClose: false });
      try {
        await dispatch(createSticktNote(body)).unwrap();
        if (addLoader) toast.dismiss(addLoader);
        toast.success("Note Created Successfully.");
        setDisplayCreateNote(false);
        getNotes();
      } catch (error) {
        if (addLoader) toast.dismiss(addLoader);
        toast.error(`${error.message}`);
      }
    } else {
      alert("Note details cannot be empty. Please enter the note details.");
    }
  };

  const handleClosePopup = () => {
    setDisplayCreateNote(false);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      {displayCreateNote && (
        <Modal
          isOpen={true}
          centered
          style={{ maxWidth: "500px", height: "450px" }}
        >
          <ModalHeader toggle={handleClosePopup} style={{ color: "black" }}>
            Create Note
          </ModalHeader>
          <ModalBody style={{ minHeight: "450px", color: "black" }}>
            <FormGroup row>
              <Label htmlFor="detail" sm={3}>
                Note Details
              </Label>
              <Col sm={6}>
                <Input
                  type="text"
                  className="form-control"
                  id="detail"
                  name="noteData"
                  aria-describedby="detail"
                  value={noteDetails}
                  onChange={(e) => {
                    setNoteDetails(e.target.value);
                  }}
                />
              </Col>
            </FormGroup>

            <button
              className="text-center btn btn-sm btn-primary m-0"
              style={{
                fontSize: "14px",
                cursor: "pointer",
              }}
              type="submit"
              onClick={handleCreateNote}
            >
              Create Note
            </button>
          </ModalBody>
        </Modal>
      )}
      <div>
        
      </div>
      <div className="main_container judgment-search-pane">
        {/* <div className="page-title">
          <div className="title_left">
            <h3>Judgement Search</h3>
          </div>
        </div> */}

        <div className="clearfix"></div>

        <div className="row h-100">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel h-100">
              {/* <div className="x_title">
                  <h2>Problem Info</h2>
                  <div className="clearfix"></div>
                </div> */}
              <div className="x_content h-100">
                <div className="d-flex justify-content-end" style={{marginBottom:'2px',position:'absolute',top:'5px',zIndex:'2',right:'20px'}} >
                <button className="btn btn-sm btn-primary" 
                    onClick={() => setDisplayCreateNote(true)}
                  >
                    <b>Create Note</b>
                </button>
                </div>
                {tableData && tableData.length > 0 ? (
                  <div className="table-responsive judgment-search-table">
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={tableData}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ClientCaseInfoDocFormsJQuery;

import { useEffect, useState, Suspense, lazy, useRef } from "react";
import axios from "axios";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";
import { WsGetCaseLaw2CaseMap } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);

const PutCaseLaw = lazy(() => import("../caseLaw/PutCaseLaw"));
const PutCaseLaw2CaseMap = lazy(() => import("./PutCaseLaw2CaseMap"));
const CaseLaws = (props) => {
  const userData = userStore((state) => state.user);
  const [showPutCaseLawMapModal, setShowPutCaseLawMapModal] = useState(false);
  const [caseLaw, setCaseLaw] = useState();

  const [caseLawMapped, setCaselawMapped] = useState([]);
  const [dataError, setDataError] = useState();
  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Case Law",
      accessor: "caseLawTxt",
    },
    {
      Header: "Action(s)",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getClientcaseLawMapped();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getClientcaseLawMapped = () => {
    setDataError();
    setCaselawMapped();
    axios
      .get(
        WsGetCaseLaw2CaseMap +
          "/" +
          props.clientCase.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setCaselawMapped(processcaseLawMapped(responseData.resultMessage));
        } else {
          //   alert(" Client Case DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
        setDataError(responseData.resultMessage);
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processcaseLawMapped = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["caseLawTxt"] = simpleData.caseLaw.partiesName+", JudgementDate: "+simpleData.caseLaw.judgementDate+" ";
      
      simpleData["actiontd"] = (
        <>
          {/* <i
            className="fa fa-pencil mx-2"
            title="Edit"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => editCaseLaw(simpleData)}
          />
          <i
            className="fa fa-suitcase mx-2"
            title="Generate Nill"
            style={{ color: "grey", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => generateCaseLaw(simpleData)}
          /> */}
          {/* <i
            className="fa fa-trash mx-2"
            title="Delete"
            style={{ color: "red", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => deleteThisCaseLawMap(simpleData)}
          /> */}
        </>
      );
    });
    return simpleDataArray;
  };

  const editCaseLaw = (caseLaw) => {
    if (
      window.confirm("Sure to Edit this '" + caseLaw.detail + "'") == true
    ) {
      let tempCaseLaw = { ...caseLaw };
      delete tempCaseLaw["actiond"];
      setCaseLaw(tempCaseLaw);
      setShowPutCaseLawMapModal(true);
    }
  };

  const deleteThisCaseLaw = (caseLaw) => {
    // console.log("deleteThisFileForMerge_fileFOrMerge", caseLaw);
    if (
      window.confirm("Sure to delete this '" + caseLaw.detail + "'") ==
      true
    ) {
    //   proceedToDeleteThisCaseLaw(caseLaw.id);
    }
  };

//   function proceedToDeleteThisCaseLaw(CaseLawId) {
//     console.log(
//       "proceedToDeleteThisCaseLaw_params",
//       JSON.stringify({
//         id: CaseLawId,
//         userId: userData.id,
//         orgId: userData.org.id,
//       })
//     );
//     axios
//       .post(
//         WsRemoveCaseLaw,
//         JSON.stringify({
//           id: CaseLawId,
//           userId: userData.id,
//           orgId: userData.org.id,
//         }),
//         {
//           headers: apiKeyHeader(),
//         }
//       )
//       .then((response) => {
//         const responseData = response.data;
//         console.log("proceedToDelete_responseData", responseData);
//         if (responseData.resultCode === 1) {
//           getClientcaseLawMapped();
//         } else {
//           toast.error(responseData.resultMessage, {
//             position: "top-center",
//             autoClose: 1800,
//           });
//           //   setErrorMsg(responseData.resultMessage);
//         }
//       })
//       .catch((error) => {
//         console.error("proceedToDelete_error", error);
//         // setErrorMsg("Error while processing");
//       });
//   }

  const onPutCaseLaw = (flag) => {
    setCaseLaw();
    if (flag) {
      getClientcaseLawMapped();
    }
    setShowPutCaseLawMapModal(false);
  };

  const generateCaseLaw = (caseLaw) => {
    let tempCaseLaw = { ...caseLaw };
    delete tempCaseLaw["actiond"];
    // setCaseLaw2Generate(tempCaseLaw);
  };

  return (
    // <Suspense fallback={<>Loading...</>}>
    //     <div className="row ms-0 me-0">
    //     <div className="col-2">
    //       <h4>
    //         Add Law
    //         {!showPutCaseLawMapModal ? (
    //           <i
    //             className="fa fa-plus mx-2"
    //             title="Add"
    //             style={{
    //               color: "#1c46f2",
    //               cursor: "pointer",
    //               fontSize: "16px",
    //             }}
    //             aria-hidden="true"
    //             onClick={() => {
    //               setShowPutCaseLawMapModal(true);
    //               //   setCaseLaw2Generate();
    //             }}
    //           />
    //         ) : (
    //           <i
    //             className="fa fa-times mx-2"
    //             title="Close"
    //             style={{
    //               color: "red",
    //               cursor: "pointer",
    //               fontSize: "24px",
    //             }}
    //             aria-hidden="true"
    //             onClick={() => {
    //               setShowPutCaseLawMapModal(false);
    //               //   setCaseLaw2Generate();
    //             }}
    //           />
    //         )}
    //       </h4>
    //     </div>
    <Suspense fallback={<>Loading...</>}>
    <div className="row ms-0 me-0">
      <div className="col-6 pt-2">
         
          
          {!showPutCaseLawMapModal ? (
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowPutCaseLawMapModal(true)}>
            <i
              className="fa fa-plus"
              title="Add"
              style={{ 
                fontSize: "16px",
              }}
              aria-hidden="true"
              
            /> {""}Add Case
            </button>
          ) : (
            null
          )}
         
      </div>
      <div className="col-6 pt-2 text-end">
        {showPutCaseLawMapModal ? (
          <button className="btn btn-sm btn-outline-danger" onClick={() => getClientcaseLawMapped()}>
            <i
              className="fa fa-times"
              title="Close"
              style={{
                fontSize: "16px",
              }}
              aria-hidden="true"
              onClick={() => {
                setShowPutCaseLawMapModal(false);
              }}
            />
          </button>
        ):(null)}
      </div>
        <div className="col-12">
          {showPutCaseLawMapModal ? (
            <>
              <PutCaseLaw2CaseMap
                caseLaw={caseLaw}
                onPutCaseLaw={onPutCaseLaw}
                clientCase={props.clientCase}
              />
            </>
          ) : (
            <>
              {caseLawMapped && caseLawMapped.length > 0 ? (
                <>
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={caseLawMapped}
                    />
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default CaseLaws;

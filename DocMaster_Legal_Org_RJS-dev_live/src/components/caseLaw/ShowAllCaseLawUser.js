import { useEffect, useState } from "react";
import CreateCaseLawUser from "../../pages/caseLaw/CreateCaseLawUser";
import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  WsGetCaseLaw2CaseMapNew,
  WsGetFileUrl,
} from "../../configs/WebService"; // Add WsGetFileUrl for the file URL API
import userStore from "../../zustand/userStore";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { changeDateFormat } from "../../OtherFunctions/OtherFunctions";

function ShowAllUserCaseLaw() {
  const userData = userStore((state) => state.user);

  const [stage, setStage] = useState(1);
  const [reposList, setReposList] = useState([]);

  const handleViewFile = async (fileUploadLocation) => {
    try {
      const response = await fetch(WsGetFileUrl, {
        method: "POST",
        headers: {
          ...apiKeyHeader(), // Spread existing headers here
        },
        body: JSON.stringify({ path: fileUploadLocation }), // Convert body to JSON
      });

      if (!response.ok) {
        throw new Error(`Error fetching file URL: ${response.statusText}`);
      }

      // Instead of parsing JSON, read the response as a blob
      const blob = await response.blob();
      console.log(blob);
      // Create a URL for the blob and open it in a new tab
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank"); // Open the PDF in a new tab
    } catch (error) {
      console.error("Error fetching file URL:", error);
      toast.error("Error fetching file URL.");
    }
  };

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Case Law",
      accessor: "caseUid",
    },
    {
      Header: "Judgement Date",
      accessor: "judgementDate",
    },
    {
      Header: "Head Note",
      accessor: "headnote",
    },
    {
      Header: "Judgement",
      accessor: "courtJudgment",
    },
    {
      Header: "Case Outcome",
      accessor: "caseOutcome",
    },
    {
      Header: "View File",
      accessor: "fileUploadLocation",
      Cell: ({ row }) => (
        <button
          onClick={() => handleViewFile(row.original.fileUploadLocation)}
          style={{
            backgroundColor: "#1c46f2",
            color: "white",
            cursor: "pointer",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
          disabled={!row.original.fileUploadLocation}
        >
          {row.original.fileUploadLocation ? "View" : "No file"}
        </button>
      ),
    },
  ];

  useEffect(() => {
    async function getRepoList() {
      try {
        const toastLoader = toast.success("Loading....");

        const response = await fetch(
          `${WsGetCaseLaw2CaseMapNew}/${userData.id}`,
          {
            method: "GET",
            headers: apiKeyHeader(),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.resultCode === 1) {
          const resultMessage = data.resultMessage;
          resultMessage.map((each, i) => {
            each["sno"] = i + 1;
            each["judgementDate"] = changeDateFormat(each.judgementDate);
            return each;
          });
          setReposList(resultMessage);
          toast.dismiss(toastLoader);
        } else {
          // toast.error("Error Getting data..!");
          console.error("Error Getting data..!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Error Getting data..!");
      }
    }

    if (stage === 1) getRepoList();
  }, [stage]);

  return (
    <div className="pt-2" style={{ marginTop: "30px" }}>
      {/* <p>
        {stage === 1 ? (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setStage(2)}
          >
            <i
              className="fa fa-plus"
              title="Add"
              style={{
                cursor: "pointer",
                fontSize: "16px",
              }}
              aria-hidden="true"
            />{" "}
            Add Repository
          </button>
        ) : (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setStage(1)}
          >
            <i
              className="fa fa-times "
              title="Close"
              style={{
                cursor: "pointer",
                fontSize: "16px",
              }}
              aria-hidden="true"
            />
          </button>
        )}
      </p> */}

      {stage === 1 && (
        <AllFeatureDataTable columns={tableColumns} data={reposList} />
      )}
      {stage === 2 && <CreateCaseLawUser handleStage={setStage} />}
    </div>
  );
}

export default ShowAllUserCaseLaw;

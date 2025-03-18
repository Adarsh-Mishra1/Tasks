import React, { Suspense, useEffect, useState } from "react";
import AllFeatureDataTable from "../GuiComponents/AllFeatureDataTable.table";
import { apiKeyHeader } from "../configs/ApiKeys";
import { ContentDisplay } from "../components/View-more-content";
import userStore from "../zustand/userStore";
import { formatAiResponse2 } from "../OtherFunctions/OtherFunctions";
import { GetOrgCaseJudgments } from "../configs/WebService";

const CaseRelatedJudgements = ({ clientCase = null }) => {
  const userData = userStore((state) => state.user);
  const [orgDepartments, setOrgDepartments] = useState([]);

  const dataTableColumns = [
    {
      Header: "S.No",
      accessor: "sno",
    },
    {
      Header: "Case Name",
      accessor: "case_name",
    },
    {
      Header: "Client Name",
      accessor: "client_name",
    },
    {
      Header: "Judgement Report",
      accessor: "judgement_report",
      Cell: ({ value }) => <ContentDisplay textContent={value} />,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${GetOrgCaseJudgments}/${userData.org.id}`,
          {
            method: "GET",
            headers: apiKeyHeader(),
          }
        );
        const data = await response.json();
        // data.map(
        //   (each) =>
        //     (each.judgement_report = formatAiResponse2(each.judgement_report))
        // );
        if (clientCase !== null) {
          const filetredData = data
            .filter((e) => e.case_id === clientCase.id)
            .map((each, i) => {
              each.sno = i + 1;
              each.judgement_report = formatAiResponse2(each.judgement_report);
              return each;
            });
          setOrgDepartments(filetredData);
        } else {
          const updatedList = data.map((each, i) => {
            each.sno = i + 1;
            each.judgement_report = formatAiResponse2(each.judgement_report);
            return each;
          });
          setOrgDepartments(updatedList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <div className="page-title mb-2">
          <div className="title_left">
            <h3 className="mt-0">Related judgement</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              <div className="x_content">
                 
                  <AllFeatureDataTable
                    columns={dataTableColumns}
                    data={orgDepartments}
                  />
                 
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CaseRelatedJudgements;

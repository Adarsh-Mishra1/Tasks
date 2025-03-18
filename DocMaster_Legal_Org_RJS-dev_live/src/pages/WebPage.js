import React, { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { WSReadWebContentByCode } from "../configs/WebService";
import { apiKeyHeader } from "../configs/ApiKeys";
import Navbar from "../components/Navbar";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const WebPage = () => {
  let query = useQuery();
  let webContentCode = query.get("page");
  const [webContent, setWebContent] = useState();

  useEffect(() => {
    if (webContentCode != undefined && webContentCode.length > 0) {
      getWebContentData(webContentCode);
    }
  }, []);

  const getWebContentData = (webContentCode) => {
    toast.success("Loading Please Wait...", { autoClose: 500 });

    axios
      .post(
        WSReadWebContentByCode,
        JSON.stringify({
          code: webContentCode,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        console.log("response_webContent", response.data);
        const responseData = response.data;
        if (responseData.result_code == 1) {
          setWebContent(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <div id="main_container">
      <Suspense fallback={<>Loading...</>}>
        <Navbar />

        <div className="right_col ps-3" role="main">
          <div
            className="col-lg-9 text-center"
            style={{
              fontSize: "16px",
            }}
          >
            <div style={{ paddingBottom: "20px" }}>
              <strong>{webContent?.title}</strong>
            </div>
            {webContent !== undefined ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: webContent.pageContent,
                }}
              />
            ) : (
              "..."
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default WebPage;

import { useEffect, useState } from "react";
import { useWebContent } from "../customHooks/webContentHook";

function ContentToPrint({ testTemplateToShow, getProcessedContent }) {
  const [processedContent, setProcessedContent] = useState("");
  const [webContentCodes, setWebContentCodes] = useState([]);
  const { webContents, isLoading } = useWebContent(webContentCodes);

  useEffect(() => {
    const elementDiv = document.createElement("div");
    elementDiv.innerHTML = testTemplateToShow;
    const aTags = elementDiv.querySelectorAll("a");
    const spans = elementDiv.querySelectorAll("span");

    // spans.forEach((span) => {
    //   if (span.textContent.includes("web_code")) {
    //     console.log("span_textContent: ", span.textContent);
    //     console.log("span_textContent_value: ", span.value);
    //     span.textContent = "hello i am shashi kumar..1";
    //   }
    // });

    aTags.forEach((aTag) => {
      // if (aTag.href.includes("webpage?page")) {
      if (aTag.href.includes("webpage?replace")) {
        const WebContentCode = aTag.href.split("=").at(-1);
        setWebContentCodes((prev) => {
          if (!prev.includes(WebContentCode)) {
            return [...prev, WebContentCode];
          }
          return prev;
        });
      }
    });

    async function formatContent() {
      const content = await processPageBreakandWebContent(testTemplateToShow);
      setProcessedContent(content);
    }

    formatContent();
  }, [testTemplateToShow]);

  useEffect(
    function () {
      const elementDiv = document.createElement("div");
      elementDiv.innerHTML = processedContent;
      const aTags = elementDiv.querySelectorAll("a");
      if (webContents?.length > 0) {
        aTags.forEach((aTag) => {
          if (aTag.href.includes("webpage?replace")) {
            const WebContentCode = aTag.href.split("=").at(-1);
            const webPageContent = webContents.find(
              (content) => `${content.webContent?.code}` === WebContentCode
            );

            if (webPageContent) {
              const spanTag = document.createElement("span");
              const tempSpanTag = document.createElement("span");
              tempSpanTag.innerHTML = webPageContent.webContent.content;
              spanTag.textContent = tempSpanTag.textContent || "No Content";
              spanTag.style.cssText = aTag.style.cssText;
              spanTag.className = aTag.className;
              aTag.replaceWith(spanTag);
            }
          }
        });
      }

      const conentProcessed = elementDiv.innerHTML;

      setProcessedContent(conentProcessed);
    },
    [webContents]
  );

  useEffect(
    function () {
      getProcessedContent(processedContent);
    },
    [processedContent]
  );

  async function processPageBreakandWebContent(content) {
    let processedContent = content.replace(
      new RegExp("<!-- pagebreak -->", "gi"),
      "<p class='pageBreakCode'></p>"
    );

    const arr = [
      "cd-hearingdate",
      "cd-purposecurhearing",
      "cd-outcome",
      "cd-attende",
      "cd-nextdate",
      "cd-purposenexhearing",
    ];

    arr.forEach((tag) => {
      const regex = new RegExp(`\\[${tag}\\]|\\[\\/${tag}\\]`, "gi");
      if (regex.test(processedContent)) {
        processedContent = processedContent.replace(regex, "");
      }
    });

    return processedContent;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: processedContent,
      }}
    />
  );
}

export default ContentToPrint;

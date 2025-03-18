function ReactPrinter({ element }) {
  return (
    <button
      className="no_print btn btn-outline-primary m-0 py-0" style={{height:"30px"}}
      onClick={() => handlePrint(element, "DocMaster_TestRun_Print")}
    >
      <i
        style={{ fontSize: 12 }}
        className="fa fa-print"
        aria-hidden="true"
      ></i>{" "}
       
    </button>
  );
}

function handlePrint(element, documentTitle) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <html>
      <head>
        <title>${documentTitle}</title>
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }
            @page {
              size: A4;
              margin: ${Number(1) * 0.3937}in ${Number(1) * 0.3937}in 
                     ${Number(1) * 0.3937}in ${Number(1) * 0.3937}in !important;
            }
          }
        </style>
      </head>
      <body>${element.current.innerHTML}</body>
    </html>
  `);
  iframeDoc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  iframe.parentNode.removeChild(iframe);
}

export default ReactPrinter;

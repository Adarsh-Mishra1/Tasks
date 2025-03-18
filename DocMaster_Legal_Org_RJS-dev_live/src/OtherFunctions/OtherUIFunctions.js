//OtherUIFunctions
export const htmlString2Print = (htmlString) => {
  // console.log("html2Print_htmlString", htmlString);
  // let htmlString2Print=processPageBreakForBackEnd(this.state.testTemplateToShow);
  // htmlString=processPageBreakForJsPrint(
  //   document.getElementById("contentToPrint").innerHTML
  // )
  //htmlString=processPageBreakForJsPrint(htmlString)
  // console.log("html2Print_htmlString",htmlString)
  var win2Print = window.open("about:blank", "_new", "width=900,height=650");
  var isChrome = Boolean(win2Print.chrome);
  var isPrinting = false;
  // win2Print.document.open();//No Need Of This
  win2Print.document.write(htmlString);
  // win2Print.document.close(); // necessary for IE >= 10 and necessary before onload for chrome
  if (isChrome) {
    win2Print.onload = function () {
      // wait until all resources loaded
      isPrinting = true;
      win2Print.focus(); // necessary for IE >= 10
      win2Print.print();
      win2Print.close();
      isPrinting = false;
    };
    setTimeout(function () {
      if (!isPrinting) {
        win2Print.print();
        win2Print.close();
      }
    }, 300);
  } else {
    win2Print.document.close(); // necessary for IE >= 10
    win2Print.focus(); // necessary for IE >= 10
    win2Print.print();
    win2Print.close();
  }
  return true;
};

import axios from "axios";
import Moment from "moment";
import { toast } from "react-toastify";
import { apiKeyHeader } from "../configs/ApiKeys";
import { WSReadWebContentByCode } from "../configs/WebService";
import { useWebContent } from "../customHooks/webContentHook";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

export const getFieldFromFieldArray = (key, fields) => {
  return fields.find((field) => field.elementUId === key);
};

export const dateFormValueToDateValueFormat = (dateFormat, dateValue) => {
  // console.log("dateFormValueToDateValueFormat_dateFormat",dateFormat)
  // console.log("dateFormValueToDateValueFormat_dateValue",dateValue)
  if (dateFormat != undefined && dateFormat != null && dateFormat.length > 4) {
    dateValue = Moment(dateValue, dateFormat).format("YYYY-MM-DD");
  } else {
    dateValue = Moment(dateValue, "DD-MM-YYYY").format("YYYY-MM-DD");
    // console.log("dateFormValueToDateValueFormat_dateValue_",dateValue)
  }
  return dateValue;
};

export function listToTreeNumeric(list) {
  var map = {},
    node,
    roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (
      node.parentId !== undefined &&
      node.parentId !== 0 &&
      node.parentId !== "0"
    ) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function listQouteToTreeNumeric(list) {
  // console.log("listQouteToTreeNumeric_list",list)
  var map = {},
    node,
    roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    // console.log("listQouteToTreeNumeric_","initialize the map for ",list[i])
    // console.log("listQouteToTreeNumeric_","initialize the map for listid ",list[i].id)
    map[list[i].id] = i; // initialize the map
    // console.log("listQouteToTreeNumeric_","initialize the children for",list[i])
    list[i].children = []; // initialize the children
    // list[i]["children"] = []; // initialize the children
  }

  // console.log("listQouteToTreeNumeric_map",map)
  // console.log("listQouteToTreeNumeric_post_list",list)

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (
      node.parentQuoteId !== undefined &&
      node.parentQuoteId !== null &&
      node.parentQuoteId !== 0 &&
      node.parentQuoteId !== "0"
    ) {
      // if you have dangling branches check that map[node.parentId] exists
      // console.log("listQouteToTreeNumeric_","initialize the map")
      // console.log("listQouteToTreeNumeric_node",node)
      // console.log("listQouteToTreeNumeric_node.parentQuoteId",node.parentQuoteId)
      // console.log("listQouteToTreeNumeric_map[node.parentQuoteId]",map[node.parentQuoteId])
      // console.log("listQouteToTreeNumeric_list[map[node.parentQuoteId]]",list[map[node.parentQuoteId]])
      list[map[node.parentQuoteId]].children.push(node);
      // if(list[map[node.parentQuoteId]]?.children!=undefined){
      //   list[map[node.parentQuoteId]].children.push(node);
      // }
      // list[map[node.parentQuoteId]]["children"].push(node);
    } else {
      roots.push(node);
    }
  }
  console.log("listQouteToTreeNumeric_roots", roots);
  return roots;
}

export function processCommaSeperated(tempvl) {
  if (tempvl.length > 0) {
    console.log("inputValuesChangeHandler", tempvl);
    var inputValues = tempvl.split(",");
    var inputValuesTemp = [];
    if (inputValues.length > 0) {
      inputValues.map((inputValue) => inputValuesTemp.push(inputValue.trim()));
      console.log("inputValuesTemp", inputValuesTemp);
      return inputValuesTemp.toString();
    } else {
      console.log("inputValuesTemp", inputValuesTemp);
      return tempvl.trim();
    }
  } else {
    return tempvl;
  }
}

export function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

export function month2MonthString(i) {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[i - 1];
}

export function getMonthFromString(mon) {
  var d = Date.parse(mon + "1, 2012");
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1;
  }
  return "";
}

export function isNetworkAlive() {
  //const linkToTest="http://localhost:8080/" //JAVA
  //const linkToTest="http://docmaster.in:8080/" //JAVA
  //const linkToTest="https://www.google.com/" //JAVA
  let isNetLive = false;
  var condition = navigator.onLine ? "online" : "offline";
  if (condition === "online") {
    isNetLive = true;
    // console.log("isNetworkAlive","CONNECTED TO INTERNET, isNetLive="+isNetLive);
  } else {
    isNetLive = false;
    // console.log("isNetworkAlive","Network Down, isNetLive="+isNetLive);
  }
  /*
  if (condition === "online") {
    console.log("ONLINE");
    fetch(linkToTest, {
      // Check for internet connectivity
      mode: "no-cors",
    }).then(() => {
        isNetLive = true;
        return isNetLive;
        console.log("isNetworkAlive","CONNECTED TO INTERNET, isNetLive="+isNetLive);
      }).catch(() => {
        isNetLive = false;
        return isNetLive;
        console.log("isNetworkAlive","INTERNET CONNECTIVITY ISSUE, isNetLive="+isNetLive);
      });
  } else {
    isNetLive = true;
    return isNetLive;
    console.log("isNetworkAlive","OFFLINE, isNetLive="+isNetLive);
  }
  */
  return isNetLive;
}

//ToProcess TimePicker
export function timeTo12HourFormat(time24hour) {
  let [h, m] = time24hour.split(":");
  return (
    (h % 12) + 12 * (h % 12 == 0) + ":" + m + " " + (h >= 12 ? "PM" : "AM")
  );
}

//ToProcess TimePicker Value
export function hrTimeTo24HourFormat(time12hour) {
  // let [h,m] = time24hour.split(":");
  // return ((h%12+12*(h%12==0))+":"+m+" "+(h >= 12 ? 'PM' : 'AM'));

  // var time = $("#starttime").val();
  if (time12hour != undefined) {
    var hours = Number(time12hour.match(/^(\d+)/)[1]);
    var minutes = Number(time12hour.match(/:(\d+)/)[1]);
    var AMPM = time12hour.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    // alert(sHours + ":" + sMinutes);

    return sHours + ":" + sMinutes;
  } else {
    return "";
  }
}

export function getAgeFromDate(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getDaysFromDate(dateString) {
  var today = new Date();
  var fromDate = new Date(dateString);
  if (today > fromDate) {
    return Math.floor(Math.abs(today - fromDate) / (1000 * 60 * 60 * 24));
  }
  // var age = today.getFullYear() - birthDate.getFullYear();
  // var m = today.getMonth() - birthDate.getMonth();
  // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //   age--;
  // }
  //   const date1 = new Date('7/13/2010');
  // const date2 = new Date('12/15/2010');
  // const diffTime = Math.abs(today - fromDate);
  // const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  // console.log(diffTime + " milliseconds");
  // console.log(diffDays + " days");
  // const diffDays = ;
  return 0;
}

export function decimalNumberFormatter(value, decimalLevel) {
  return Number(value).toFixed(Number(decimalLevel));
}

export function processPageBreak(content) {
  /*//Old
  return content.replaceAll(
    "<!-- pagebreak -->",
    "<p class='pageBreakCode'></p>"
  );
  */

  return content.replace(
    new RegExp("<!-- pagebreak -->", "gi"),
    "<p class='pageBreakCode'></p>"
  );
}

export function processPageBreakandContent(content) {
  let processedContent = content.replace(
    new RegExp("<!-- pagebreak -->", "gi"),
    "<p class='pageBreakCode'></p>"
  );

  const arr = [
    "cd-hearingdate",
    "cd-result",
    "cd-attende",
    "cd-nextdateofhearing",
    "cd-purpose",
  ];

  arr.forEach((tag) => {
    const regex = new RegExp(`\\[${tag}\\]|\\[\\/${tag}\\]`, "gi");
    if (regex.test(processedContent)) {
      processedContent = processedContent.replace(regex, "");
    }
    processedContent = processedContent.replace(regex, "");
  });

  return processedContent;
}

// export async function processPageBreakandWebContent(content) {
//   let processedContent = content.replace(
//     new RegExp("<!-- pagebreak -->", "gi"),
//     "<p class='pageBreakCode'></p>"
//   );

//   const arr = [
//     "cd-hearingdate",
//     "cd-result",
//     "cd-attende",
//     "cd-nextdateofhearing",
//     "cd-purpose",
//   ];

//   arr.forEach((tag) => {
//     const regex = new RegExp(`\\[${tag}\\]|\\[\\/${tag}\\]`, "gi");
//     if (regex.test(processedContent)) {
//       processedContent = processedContent.replace(regex, "");
//     }
//     processedContent = processedContent.replace(regex, "");
//   });

//   console.log("processedContent_315: ", processedContent);

//   const elementDiv = document.createElement("div");
//   elementDiv.innerHTML = processedContent;
//   const aTags = elementDiv.querySelectorAll("a");
//   aTags.forEach(async (aTag) => {
//     if (aTag.href.includes("webpage?page")) {
//       const spanTag = document.createElement("span");
//       const WebContentCode = aTag.href.split("=").at(-1);
//       const WebContent = await getWebContentByCode(WebContentCode);
//       console.log("WebContent_334: ", WebContent);
//       spanTag.textContent = "New Content By ShashiKumar";
//       aTag.replaceWith(spanTag);
//     }
//   });

//   processedContent = elementDiv.innerHTML;

//   return processedContent;
// }

export async function processPageBreakandWebContent(content) {
  let processedContent = content.replace(
    new RegExp("<!-- pagebreak -->", "gi"),
    "<p class='pageBreakCode'></p>"
  );

  const arr = [
    "cd-hearingdate",
    "cd-result",
    "cd-attende",
    "cd-nextdateofhearing",
    "cd-purpose",
  ];

  arr.forEach((tag) => {
    const regex = new RegExp(`\\[${tag}\\]|\\[\\/${tag}\\]`, "gi");
    if (regex.test(processedContent)) {
      processedContent = processedContent.replace(regex, "");
    }
    processedContent = processedContent.replace(regex, "");
  });

  console.log("processedContent_315: ", processedContent);

  const elementDiv = document.createElement("div");
  elementDiv.innerHTML = processedContent;
  const aTags = elementDiv.querySelectorAll("a");
  for (const aTag of aTags) {
    if (aTag.href.includes("webpage?page")) {
      const spanTag = document.createElement("span");
      // const WebContentCode = aTag.href.split("=").at(-1);
      // const WebContent = await getWebContentByCode(WebContentCode);
      spanTag.innerHTML = "WebContent" || "New Content By ShashiKumar";
      aTag.replaceWith(spanTag);
    }
  }
  processedContent = elementDiv.innerHTML;
  return processedContent;
}

async function getWebContentByCode(webContentCode) {
  const loader = toast.success("Loading Please Wait...", { autoClose: false });

  try {
    const response = await axios.post(
      WSReadWebContentByCode,
      JSON.stringify({
        code: webContentCode,
      }),
      {
        headers: apiKeyHeader(),
      }
    );

    const responseData = response.data;
    await toast.dismiss(loader);

    if (responseData.result_code === 1) {
      // Return the content after successful fetch
      return responseData.result_message.pageContent;
    } else {
      toast.error("Error getting Data");
      return null; // Return null or an appropriate value on error
    }
  } catch (error) {
    console.error("error", error);
    await toast.dismiss(loader);
    toast.error("Error getting Data");
    return null; // Return null on catch as well
  }
}

export function processPageBreakForDoc(content) {
  /*//Old
  return content.replaceAll(
    "<!-- pagebreak -->",
    "<p class='pageBreakCode'></p>"
  );
  */
  return content.replace(
    new RegExp('<p class="pageBreakCode"></p>', "gi"),
    "<br style='page-break-before: always'>"
  );
}

export function processPageBreakForDocTest(content) {
  return content.replace(
    new RegExp('<p style="page-break-before: always;"></p>', "gi"),
    "<br style='page-break-before: always'>"
  );
}

//on 20-12-2021 For To Print Using JS
export function processPageBreakForJsPrint(content) {
  return content.replace(
    new RegExp('<p class="pageBreakCode"></p>', "gi"),
    "<p style='page-break-before: always'></p>"
  );
}

//on 20-12-2021 For HtmlToPdf using iTextPdf
export function processPageBreakForBackEnd(content) {
  return content.replaceAll(
    "<!-- pagebreak -->",
    "<p style='page-break-before: always;'></p>"
  );
}

export function changeDateFormat(date) {
  if (!date) {
    return "Invalid Date";
  }
  const customdate = new Date(date);
  if (isNaN(customdate)) {
    return "Invalid Date";
  }
  const formattedDate = `${customdate.getDate().toString().padStart("2", 0)}-${(
    customdate.getMonth() + 1
  )
    .toString()
    .padStart("2", 0)}-${customdate.getFullYear()}`;
  return formattedDate;
}

export function convertToDateFormatCD(dateString) {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
}

// export function formatAiResponse(response) {
//   let formatted = response.replace(/\n/g, "<br />");
//   formatted = formatted.replace(/(\d+\))/g, "<li>$1</li>");
//   formatted = `<ol>${formatted}</ol>`;
//   formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
//   formatted.replaceAll("*", "");
//   return formatted;
// }

// export function formatAiResponse(response) {
//   let formatted = response.replace(/\n/g, "<br />");
//   formatted = formatted.replace(/(\d+\))/g, "<li>$1</li>");
//   formatted = `<ol>${formatted}</ol>`;
//   formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
//   formatted = formatted.replace(/\*/g, "");
//   return formatted;
// }

export function formatAiResponse(response) {
  return response
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

// export function formatAiResponse2(response) {
//   return response
//     .replace(/:/g, "")
//     .replace(/\n/g, "<br>")
//     .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//     .replace(/\*(.*?)\*/g, "<em>$1</em>");
// }

// feb 4
export function formatAiResponse2(response) {
  return (
    response
      .replace(/:/g, "")
      .replace(/\n/g, "<div style={{marginTop:'0px'}}>")
      // .replace(/\n/g, "<br>")
      .replace(/\\(.?)\\*/g, "<strong>$1</strong>")
      .replace(/\(\w*\*\)/g, "$1")
      .replace(/\(.*?\)/g, "")
  );
}

export function formatResearchAiResponse(response) {
  return response
    .replace(/\n/g, "<br>") // Convert newlines to <br> for line breaks.
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold formatting for text wrapped in **.
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic formatting for text wrapped in *.
    .replace(/^(.+?):\s/, "<strong>$1:</strong> "); // Bold the prefix (like aiData_233:) at the start.
}

// export function addDaysToDate(nextDate, numberOfDays) {
//   if (nextDate !== "" || nextDate !== null) {
//     let date = new Date(nextDate);
//     date.setDate(date.getDate() + numberOfDays);
//     return date.toISOString().split("T")[0];
//   }
// }
// export function addDaysToDate(nextDate, numberOfDays) {
//   if (!nextDate || isNaN(new Date(nextDate).getTime())) {
//     return null; // Return null for invalid dates
//   }

//   console.log("numberOfDays_538: ", numberOfDays);

//   let date = new Date(nextDate);
//   date.setDate(date.getDate() + numberOfDays);

//   // Convert to DD-MM-YYYY format
//   let day = String(date.getDate()).padStart(2, "0");
//   let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//   let year = date.getFullYear();

//   return ` ${day}-${month}-${year}`;
// }

export function addDaysToDate(nextDate, numberOfDays) {
  if (!moment(nextDate, "YYYY-MM-DD", true).isValid() || isNaN(numberOfDays)) {
    return null; // Return null for invalid input
  }

  return moment(nextDate, "YYYY-MM-DD")
    .add(Number(numberOfDays), "days")
    .format("DD-MM-YYYY");
}

export const handleRaiseConcern = (userData) => {
  const ticketingURL = `https://ticketing.docmaster.in/?email=${userData.email_id}&name=${userData.name}&userId=${userData.id}&userType=User`;
  window.open(ticketingURL, "_blank");
};

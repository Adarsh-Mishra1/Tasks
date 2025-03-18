import { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";

import {
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  forEach,
  isNumber,
  log,
  pi,
  pow,
  round,
  sqrt,
} from "mathjs";

import { feeConditions } from "./FeesCalculatorConditionsDelAndChd";
import {
  calculateCourtFees,
  recoveryOfRentFeeCondition,
} from "../../components/legalOrg/FeesCalculatorConditions";

export const pecuniaryJuridictionComrclDsptDelhiCrt = (caseAmountValue) => {
  if (caseAmountValue > 0) {
    if (caseAmountValue <= 300000) {
      return "Civil Judge";
    } else if (caseAmountValue > 300001 && caseAmountValue <= 20000000) {
      return "District Judge";
    } else if (caseAmountValue > 20000001) {
      return "High Courts of Delhi";
    }
  } else {
    return null;
  }
};

export const calculateLegalFeeCourtDelhiAndChd = (caseAmountValue) => {
  if (caseAmountValue > 0) {
    return proceed2calculateFees(caseAmountValue);
  } else {
    return null;
  }
};

// export const chequeUnPaidOffenceString = (days, formData = null) => {
//   let next90daysDate = "";

//   if (formData?.receipt_datecopy78copy00) {
//     const [day, month, year] = formData.receipt_datecopy78copy00.split("-");
//     const formattedDate = `${year}-${month}-${day}`;

//     const receiptDate = new Date(formattedDate);

//     if (!isNaN(receiptDate.getTime())) {
//       receiptDate.setDate(receiptDate.getDate() + 90);

//       const newDay = String(receiptDate.getDate()).padStart(2, "0");
//       const newMonth = String(receiptDate.getMonth() + 1).padStart(2, "0");
//       const newYear = receiptDate.getFullYear();

//       next90daysDate = `${newDay}-${newMonth}-${newYear}`;
//     } else {
//       next90daysDate = "Invalid Date";
//     }
//   } else {
//     next90daysDate = "Date not provided";
//   }

//   if (days <= 29) {
//     return "A Notice is required to be served within thirty days to initiate proceeding under The Negotiable Instruments Act. <br/>Notice should be served before ";
//   } else {
//     // formData.date_add_days = "";
//     formData.date_add_dayscopy78copy00 = "";
//     return `A Notice was required to be served within thirty days to initiate proceeding under The Negotiable Instruments Act.<br/>As the limitation period has expired and if notice has not been served, you can present it again before ${next90daysDate} from the date of cheque to revive the limitation period`;
//   }
// };

// new code
export const chequeUnPaidOffenceString = (days, formData = null) => {
  let next90daysDate = "";

  if (formData?.receipt_date) {
    const [day, month, year] = formData.receipt_date.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    const receiptDate = new Date(formattedDate);

    if (!isNaN(receiptDate.getTime())) {
      receiptDate.setDate(receiptDate.getDate() + 30);
      // receiptDate.setDate(receiptDate.getDate() + 90);

      const newDay = String(receiptDate.getDate()).padStart(2, "0");
      const newMonth = String(receiptDate.getMonth() + 1).padStart(2, "0");
      const newYear = receiptDate.getFullYear();

      next90daysDate = `${newDay}-${newMonth}-${newYear}`;
    } else {
      next90daysDate = "Invalid Date";
    }
  } else {
    next90daysDate = "Date not provided";
  }

  if (days <= 29) {
    return "A Notice is required to be served within thirty days to initiate proceeding under The Negotiable Instruments Act. <br/>Notice should be served before ";
  } else {
    formData.date_add_days = "";
    return `As per The dishonour memo date you have entered, a notice was required to serve within thirty days, on or before ${next90daysDate} to initiate legal proceeding under The Negotiable Instruments Act. <br/>Alternatively, if the validity of the cheque is still there, and if notice has not been served, you can re-present the cheque again with the bank before the 90 days of the date of the cheque to revive the limitation period and initiate legal proceeding`;
  }
};

const proceed2calculateFees = (caseAmountValue) => {
  let returnFees = 0;
  console.log("caseAmountValue: ", caseAmountValue);
  if (caseAmountValue > 400000) {
    returnFees = calculateCourtFees(caseAmountValue);
  } else {
    const conditionStatements = recoveryOfRentFeeCondition
      .filter((each) => each.state === "Delhi and Chandigarh")
      .at(0)?.condition;

    conditionStatements.forEach(function (conditionStatement, index) {
      if (
        isPropertyValueFallInConditionRange(
          caseAmountValue,
          conditionStatement.valueOfProperty
        )
      ) {
        returnFees = evaluteConditionString(
          caseAmountValue,
          conditionStatement.courtFees
        );
      }
    });
  }
  return returnFees;
};
// const proceed2calculateFees = (caseAmountValue) => {
//   let returnFees = 0;
//   let stop = false;
//   feeConditions.forEach(function (conditionStatement, index) {
//     // console.log("conditionStatement",conditionStatement);
//     if (stop) {
//       return; // Skip the remaining iterations
//     }
//     if (
//       isPropertyValueFallInConditionRange(
//         caseAmountValue,
//         conditionStatement.amountMinMax
//       )
//     ) {
//       console.log("evaluteUsingConditionArray_evalfor", conditionStatement);

//       //fixFee + fee increases @ atRateFee for every forEveryPartAmount Rupees
//       //fixFee + atRateFee * (amountOfCase/forEveryPartAmount)
//       returnFees =
//         conditionStatement.fixFee +
//         conditionStatement.atRateFee *
//           (caseAmountValue / conditionStatement.forEveryPartAmount);
//       console.log("evaluteUsingConditionArray_returnFees_", returnFees);
//       // returnFees = evaluteConditionString(
//       //     caseAmountValue,
//       //   conditionStatement.amountMinMax,
//       // );
//     }
//     if (returnFees > 0) {
//       stop = true;
//     }
//   });
//   console.log("evaluteUsingConditionArray_returnFees", returnFees);
//   return returnFees;
// };

const isPropertyValueFallInConditionRange = (propertyValue, minMaxRanges) => {
  // console.log("isPropertyValueFallInConditionRange_propertyValue","Start:-------------------------------------------------");
  // console.log("isPropertyValueFallInConditionRange_propertyValue",propertyValue);
  let minMaxRangeAry = minMaxRanges.split(",");
  // console.log("isPropertyValueFallInConditionRange_minMaxRangeAry",minMaxRangeAry);
  // console.log("isPropertyValueFallInConditionRange_minMaxRangeAry.length",minMaxRangeAry.length);

  if (minMaxRangeAry.length > 1) {
    // console.log("isPropertyValueFallInConditionRange_min",Number(minMaxRangeAry[0]));
    // console.log("isPropertyValueFallInConditionRange_max",Number(minMaxRangeAry[1]));
    if (
      propertyValue > Number(minMaxRangeAry[0]) &&
      propertyValue <= Number(minMaxRangeAry[1])
    ) {
      console.log(
        "isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0]) && propertyValue<=Number(minMaxRangeAry[1])_return",
        true
      );
      return true;
    }

    // console.log("isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0]) && propertyValue<=Number(minMaxRangeAry[1])_return",false);
  } else {
    if (propertyValue > Number(minMaxRangeAry[0])) {
      console.log(
        "isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0])_return",
        true
      );
      return true;
    }
    // console.log("isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0])_return",false);
  }
  return false;
};

const evaluteConditionString = (propertyValue, conditionStatement) => {
  console.log("evaluteConditionString_before", conditionStatement);
  conditionStatement = conditionStatement.replace(
    new RegExp("value", "gi"),
    propertyValue
  );
  console.log(
    "evaluteConditionString_conditionStatement_after",
    conditionStatement
  );
  return evaluate(conditionStatement);
};

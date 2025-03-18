import { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";

import {
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  forEach,
  log,
  pi,
  pow,
  round,
  sqrt,
} from "mathjs";

import { feeConditions } from "./FeesCalculatorConditionsDelAndChd";

const FeeCalculatorSub0 = () => {
  const [caseAmount, setCaseAmount] = useState(0);

  const calculateFees = (caseAmountValue) => {
    if (caseAmountValue > 0) {
      return proceed2calculateFees(caseAmountValue);
    } else {
      return null;
    }
  };

  const proceed2calculateFees = (caseAmountValue) => {
    let returnFees = 0;
    let stop = false;
    feeConditions.forEach(function (conditionStatement, index) {
      // console.log("conditionStatement",conditionStatement);
      if (stop) {
        return; // Skip the remaining iterations
      }
      if (
        isPropertyValueFallInConditionRange(
          caseAmountValue,
          conditionStatement.amountMinMax,
        )
      ) {
        console.log("evaluteUsingConditionArray_evalfor", conditionStatement);

        //fixFee + fee increases @ atRateFee for every forEveryPartAmount Rupees
        //fixFee + atRateFee * (amountOfCase/forEveryPartAmount)
        returnFees =
          conditionStatement.fixFee +
          conditionStatement.atRateFee *
            (caseAmountValue / conditionStatement.forEveryPartAmount);
        console.log("evaluteUsingConditionArray_returnFees_", returnFees);
        // returnFees = evaluteConditionString(
        //     caseAmountValue,
        //   conditionStatement.amountMinMax,
        // );
      }
      if (returnFees > 0) {
        stop = true;
      }
    });
    console.log("evaluteUsingConditionArray_returnFees", returnFees);
    return returnFees;
  };

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
          true,
        );
        return true;
      }

      // console.log("isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0]) && propertyValue<=Number(minMaxRangeAry[1])_return",false);
    } else {
      if (propertyValue > Number(minMaxRangeAry[0])) {
        console.log(
          "isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0])_return",
          true,
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
      propertyValue,
    );
    console.log(
      "evaluteConditionString_conditionStatement_after",
      conditionStatement,
    );
    return evaluate(conditionStatement);
  };

  return (
    <>
      <div className="page-title">
          <div className="title_left">
            <h3>Court Fees Delhi & Chandigarh</h3>
          </div>
        </div>
      <FormGroup className="mb-3" row>
        <Label htmlFor="inputCaseAmount" sm={2}>
          Value of Case
        </Label>
        <Col sm={10}>
          <Input
            type="number"
            className="form-control "
            id="inputCaseAmount"
            aria-describedby="caseAmountHelp"
            // value={researchTypeId}
            onChange={(e) => {
              setCaseAmount(Number(e.target.value));
            }}
          />
        </Col>
      </FormGroup>

      <FormGroup className="mb-3" row>
        <Label htmlFor="courtFees" sm={2}>
          Fees
        </Label>
        <Col sm={10}>
          {caseAmount > 0 ? <>{calculateFees(caseAmount)}</> : 0}
        </Col>
      </FormGroup>
    </>
  );
};

export default FeeCalculatorSub0;

// import { useState } from "react";
// import { FormGroup, Label, Input, Col } from "reactstrap";

// import {
//   calculateCourtFees,
//   recoveryOfRentFeeCondition,
// } from "./FeesCalculatorConditions";

// import { evaluate } from "mathjs";

// const FeeCalculatorSub1 = () => {
//   const [cityState, setCityState] = useState();
//   const [propertyValue, setPropertyValue] = useState(0);

//   const calculateFees = (cityState, propertyValue) => {
//     if (cityState === "Delhi and Chandigarh") {
//       if (cityState != undefined && propertyValue > 0) {
//         if (cityState === "Delhi and Chandigarh" && propertyValue > 400000) {
//           const courtFee = calculateCourtFees(propertyValue);
//           return courtFee;
//         } else {
//           let conditionObject = filterCondtion(cityState);
//           if (conditionObject != null) {
//             return evaluteUsingConditionArray(
//               propertyValue,
//               conditionObject.condition
//             );
//           } else {
//             return "Not found";
//           }
//         }
//       } else {
//         return 0;
//       }
//     } else {
//       return 0;
//     }
//   };
//   // const calculateFees = (cityState, propertyValue) => {
//   //   if (cityState != undefined && propertyValue > 0) {
//   //     let conditionObject = filterCondtion(cityState);
//   //     if (conditionObject != null) {
//   //       return evaluteUsingConditionArray(
//   //         propertyValue,
//   //         conditionObject.condition
//   //       );
//   //     } else {
//   //       return "Not found";
//   //     }
//   //   } else {
//   //     return 0;
//   //   }
//   // };

//   const evaluteUsingConditionArray = (propertyValue, conditionStatements) => {
//     let returnFees = 0;
//     let stop = false;
//     conditionStatements.forEach(function (conditionStatement, index) {
//       if (stop) {
//         return;
//       }
//       if (
//         isPropertyValueFallInConditionRange(
//           propertyValue,
//           conditionStatement.valueOfProperty
//         )
//       ) {
//         returnFees = evaluteConditionString(
//           propertyValue,
//           conditionStatement.courtFees
//         );
//       }
//       if (returnFees > 0) {
//         stop = true;
//       }
//     });
//     return returnFees;
//   };

//   const isPropertyValueFallInConditionRange = (propertyValue, minMaxRanges) => {
//     // console.log("isPropertyValueFallInConditionRange_propertyValue","Start:-------------------------------------------------");
//     // console.log("isPropertyValueFallInConditionRange_propertyValue",propertyValue);
//     let minMaxRangeAry = minMaxRanges.split(",");
//     // console.log("isPropertyValueFallInConditionRange_minMaxRangeAry",minMaxRangeAry);
//     // console.log("isPropertyValueFallInConditionRange_minMaxRangeAry.length",minMaxRangeAry.length);

//     if (minMaxRangeAry.length > 1) {
//       // console.log("isPropertyValueFallInConditionRange_min",Number(minMaxRangeAry[0]));
//       // console.log("isPropertyValueFallInConditionRange_max",Number(minMaxRangeAry[1]));
//       if (
//         propertyValue > Number(minMaxRangeAry[0]) &&
//         propertyValue <= Number(minMaxRangeAry[1])
//       ) {
//         console.log(
//           "isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0]) && propertyValue<=Number(minMaxRangeAry[1])_return",
//           true
//         );
//         return true;
//       }

//       // console.log("isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0]) && propertyValue<=Number(minMaxRangeAry[1])_return",false);
//     } else {
//       if (propertyValue > Number(minMaxRangeAry[0])) {
//         console.log(
//           "isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0])_return",
//           true
//         );
//         return true;
//       }
//       // console.log("isPropertyValueFallInConditionRange_propertyValue>Number(minMaxRangeAry[0])_return",false);
//     }
//     return false;
//   };

//   const evaluteConditionString = (propertyValue, conditionStatement) => {
//     conditionStatement = conditionStatement.replace(
//       new RegExp("value", "gi"),
//       propertyValue
//     );
//     return evaluate(conditionStatement);
//   };

//   const filterCondtion = (stateName) => {
//     let condition = recoveryOfRentFeeCondition.filter(
//       (recoveryOfRentFeeConditionObj) => {
//         return (
//           recoveryOfRentFeeConditionObj?.state.toLowerCase() ==
//           stateName.toLowerCase()
//         );
//       }
//     );

//     if (condition.length > 0) {
//       return condition[0];
//     } else {
//       return null;
//     }
//   };
//   return (
//     <>
//       {/* <h6>
//         For suits relating to the possession of immovable propert or recovery of
//         rent
//       </h6> */}
//       <FormGroup className="mb-3" row style={{ marginTop: "33px" }}>
//         <Label htmlFor="inputState" sm={2}>
//           Select State{" "}
//         </Label>
//         <Col sm={10}>
//           <Input
//             type="select"
//             className="form-control "
//             id="inputState"
//             aria-describedby="stateHelp"
//             // value={researchTypeId}
//             onChange={(e) => {
//               setCityState(e.target.value);
//             }}
//           >
//             <option>-Select-</option>
//             <option value={"Delhi and Chandigarh"}>Delhi</option>
//             <option value={"Uttar Pradesh"}>Uttar Pradesh</option>
//             <option value={"Madhya Pradesh"}>Madhya Pradesh</option>
//             <option value={"Maharashtra"}>Maharashtra</option>
//             <option value={"Bihar"}>Bihar</option>
//             <option value={"Rajasthan"}>Rajasthan</option>
//             <option value={"Gujarat"}>Gujarat</option>
//             <option value={"Haryana"}>Haryana</option>
//             <option value={"Delhi and Chandigarh"}>Chandigarh</option>
//             <option value={"Punjab"}>Punjab</option>
//             <option value={"Himachal Pradesh"}>Himachal Pradesh</option>
//             <option value={"Uttarakhand"}>Uttarakhand</option>
//           </Input>
//         </Col>
//       </FormGroup>
//       <FormGroup className="mb-3" row>
//         <Label htmlFor="inputPropertyValue" sm={2}>
//           Value of Suit
//         </Label>
//         <Col sm={10}>
//           <Input
//             type="number"
//             className="form-control "
//             id="inputPropertyValue"
//             aria-describedby="propertyValueHelp"
//             // value={researchTypeId}
//             onChange={(e) => {
//               setPropertyValue(Number(e.target.value));
//             }}
//           />
//         </Col>
//       </FormGroup>

//       <FormGroup className="mb-3" row>
//         <Label htmlFor="courtFees" sm={2}>
//           Fees
//         </Label>
//         <Col sm={10}>
//           {cityState != undefined && propertyValue > 0 ? (
//             <>{calculateFees(cityState, propertyValue)}</>
//           ) : (
//             0
//           )}
//         </Col>
//       </FormGroup>
//     </>
//   );
// };

// export default FeeCalculatorSub1;

// import NewFeeCalculator from "./newCourtFee/FeeCalculator";
import NewFeeCalculator from "./newCourtfee/FeeCalculator";

export default function FeeCalculatorSub1() {
  return (
    <div>
      <NewFeeCalculator />
    </div>
  );
}

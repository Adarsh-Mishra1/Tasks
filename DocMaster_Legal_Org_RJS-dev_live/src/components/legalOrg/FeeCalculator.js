//Court FeeCalculator.js
import { useEffect, useState, Suspense, lazy } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";

// import ReactSelect from "react-select";

const FeeCalculatorSub0 = lazy(() => import("./FeeCalculatorSub0"));
const FeeCalculatorSub1 = lazy(() => import("./FeeCalculatorSub1"));

const FeeCalculator = () => {
  const [caseType, setCaseType] = useState();
  return (
    <Suspense fallback={<>Loading...</>}>
      <FormGroup className="mb-3" row>
        <Label htmlFor="caseType" sm={2}>
          Case Type
        </Label>
        <Col sm={10}>
          <Input
            type="select"
            className="form-control "
            id="inputCaseType"
            aria-describedby="caseTypeHelp"
            // value={researchTypeId}
            onChange={(e) => {
              setCaseType(e.target.value);
            }}
          >
            <option>-Select-</option>

            <option value={"CrtFeeDelhChnd"}>
              Court Fees Delhi & Chandigarh
            </option>

            <option value={"rcvofrent"}>
              For suits relating to the possession of immovable propert or
              recovery of rent
            </option>

            <option value={"AdValorem"}>
              Ad Valorem Court Fees Calculator for Civil Case
            </option>
            <option value={"CnsmrCrtAndJur"}>
              Consumer Court Fee and Jurisdiction Calculator
            </option>

            {/* Consumer Court Fee and Jurisdiction Calculator */}
            {/* DRT SA Court Fees Calculator For an Aggrieved Party other than Borrower */}
            {/* DRT OA Court Fee Calculator */}
          </Input>
          {/* <ReactSelect
                                options={orgClients}
                                onChange={(selectedOption) => {
                                  console.log(
                                    "handleUsersReactSelectChanges",
                                    selectedOption
                                  );
                                  setSelectedClient(selectedOption);
                                }}
                                // ref={departmentRef}
                                isMulti={false}
                                //   defaultValue={{}}
                              /> */}
        </Col>
      </FormGroup>
      <div>
        {caseType == "rcvofrent" ? <FeeCalculatorSub1 /> : null}
        {caseType == "CrtFeeDelhChnd" ? <FeeCalculatorSub0 /> : null}

        <></>
      </div>
    </Suspense>
  );
};

export default FeeCalculator;

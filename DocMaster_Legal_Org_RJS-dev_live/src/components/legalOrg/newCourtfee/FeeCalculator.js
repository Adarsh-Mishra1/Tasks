import { useState, useEffect, useCallback } from "react";
import { FormGroup, Label, Input, Col } from "reactstrap";
import { getUserStates, getFee, getNatureOfSuites } from "./dataservice";

const NewFeeCalculator = () => {
  const [data, setData] = useState({
    statesList: [],
    nature_of_suite: [],
    selectedState: "",
    value_of_suit: "1",
    courtFee: "",
    nature_of_suit_name: "",
    resMsg: "",
  });

  // Fetch states data
  const fetchData = useCallback(async (list_name, endptfunc) => {
    try {
      const result = await endptfunc;
      setData((prev) => ({
        ...prev,
        [list_name]: result || [],
      }));
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }, []);

  useEffect(() => {
    fetchData("statesList", getUserStates());
    fetchData("nature_of_suite", getNatureOfSuites());
  }, [fetchData]);

  useEffect(() => {
    if (data.selectedState && data.nature_of_suit_name && data.value_of_suit) {
      handleFee(data.nature_of_suit_name, data.value_of_suit);
    }
  }, [data.selectedState, data.nature_of_suit_name, data.value_of_suit]);

  // Update state values dynamically
  const handleInput = (value, key) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFee = async (value2, value3) => {
    const try_val = {
      // state_id, nature_of_suit, value_of_suit
      state_id: Number(`${data.selectedState}`),
      nature_of_suit: Number(value2),
      value_of_suit: Number(value3),
    };
    console.log(try_val);
    try {
      const feesRes = await getFee({
        state_id: Number(`${data.selectedState}`),
        nature_of_suit: Number(`${data.nature_of_suit_name}`),
        value_of_suit: Number(`${data.value_of_suit}`),
      });
      console.log("feesRes", feesRes);
      if (feesRes) {
        setData((prev) => ({
          ...prev,
          courtFee: feesRes?.courtFee
            ? Number(feesRes.courtFee).toFixed(2)
            : "",
          resMsg: feesRes?.message && !feesRes?.courtFee ? feesRes.message : "",
        }));
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* <h6>
        For suits relating to the possession of immovable propert or recovery of
        rent
      </h6> */}
      {/* state */}
      <FormGroup className="mb-3" row style={{ marginTop: "2%" }}>
        <Label htmlFor="inputState" sm={2}>
          Select State <span style={{ color: "red" }}>*</span>
        </Label>
        <Col sm={10}>
          <Input
            type="select"
            className="form-control "
            id="inputState"
            aria-describedby="stateHelp"
            value={data.selectedState}
            onChange={(e) => {
              handleInput(e.target.value, "selectedState");
              handleInput("", "nature_of_suit_name");
              handleInput("", "courtFee");
              handleInput("", "resMsg");
            }}
          >
            <option>-Select-</option>
            {data.statesList &&
              data.statesList.map((each) => (
                <option key={each.id} value={each.id}>
                  {each.state_name}
                </option>
              ))}
          </Input>
        </Col>
      </FormGroup>
      {/* nature of suite */}
      {data.selectedState && (
        <FormGroup className="mb-3" row style={{ marginTop: "3px" }}>
          <Label htmlFor="inputState" sm={2}>
            Select Nature of Suit <span style={{ color: "red" }}>*</span>
          </Label>
          <Col sm={10}>
            <Input
              type="select"
              className="form-control "
              id="inputState"
              aria-describedby="stateHelp"
              value={data.nature_of_suit_name}
              onChange={(e) => {
                const suit_name = e.target.value;
                handleInput(suit_name, "nature_of_suit_name");
                // handleInput(1, "value_of_suit");
                if (suit_name) {
                  handleFee(suit_name, `${data.value_of_suit}`);
                }
              }}
            >
              <option>-Select-</option>
              {data.nature_of_suite.map((each) => (
                <option key={each.id} value={each.id}>
                  {each.nature_of_suit_name}
                </option>
              ))}
            </Input>
          </Col>
        </FormGroup>
      )}

      {data.selectedState && data.nature_of_suit_name && (
        <FormGroup className="mb-3" row>
          <Label htmlFor="inputPropertyValue" sm={2}>
            Value of Suit
            <span style={{ color: "red" }}>*</span>
          </Label>
          <Col sm={10}>
            <Input
              type="number"
              min={1}
              className="form-control"
              id="inputPropertyValue"
              aria-describedby="propertyValueHelp"
              value={data.value_of_suit}
              onChange={async (e) => {
                const suit_value = e.target.value;
                if (suit_value != "0") {
                  handleInput(suit_value, "value_of_suit");
                  // handleFee(`${data.nature_of_suit_name}`, suit_value);
                }
                if (suit_value == "0") {
                  alert("value of suit can't be zero");
                }
              }}
            />
          </Col>
        </FormGroup>
      )}

      {data.courtFee && data.value_of_suit ? (
        <FormGroup className="mb-3" row>
          <Label htmlFor="courtFees" sm={2}>
            Fees
          </Label>
          <Col sm={10}> ₹ {data.courtFee}</Col>
        </FormGroup>
      ) : (
        <></>
      )}
      {data.resMsg && data.value_of_suit && (
        <p style={{ color: "red" }}>{data.resMsg}</p>
      )}
    </>
  );
};

export default NewFeeCalculator;

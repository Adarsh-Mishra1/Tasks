//CustomMultiCheckBox.js
import React, { useEffect, useState } from "react";
import { Input } from "reactstrap";

export default function CustomMultiCheckBox(props) {
  console.log("__6__: ", props);
  let defaultValues = props.defaultValue
    ?.split(",")
    .map(function (value) {
      return value.trim();
    })
    .filter(function (i) {
      return i;
    });

  useEffect(
    function () {
      setOptions(props.options);
    },
    [props.options]
  );

  // useEffect(
  //   function () {
  //     setSelectedValues(
  //       defaultValues != undefined && defaultValues.length > 0
  //         ? defaultValues
  //         : []
  //     );
  //   },
  //   [defaultValues]
  // );

  //console.log("CustomMultiCheckBox_props",props)
  const [options, setOptions] = useState(props.options);
  // const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState(
    defaultValues != undefined && defaultValues.length > 0 ? defaultValues : []
  );

  //Changed on 13-12-2021
  function onCheckBoxSelect(e, type) {
    if (e.target.checked) {
      selectedValues.push(e.target.value);
    } else {
      var indexOfOption = selectedValues.indexOf(e.target.value);
      if (indexOfOption > -1) {
        selectedValues.splice(indexOfOption, 1);
      }
    }

    if (selectedValues.length > props.maxSelect) {
      e.target.checked = false;
      selectedValues.pop();
      alert("Can't Select more than " + props.maxSelect);
    } else if (selectedValues.length < props.minSelect) {
      alert("Select at least " + props.minSelect);
    } else {
      e.target.value = selectedValues.filter(function (item, i, ar) {
        return ar.indexOf(item) === i;
      });
      e.target.tempValue = selectedValues.filter(function (item, i, ar) {
        return ar.indexOf(item) === i;
      });
      console.log("onCheckBoxSelect_selectedValues_tempValue", selectedValues);
      console.log("onCheckBoxSelect_tempValue", e.target.value);
      console.log("onCheckBoxSelect_tempValue-tempValue", e.target.tempValue);
      props.onOptionSelect(e);
    }
  }

  return (
    <>
      {options.map((option) => (
        <p key={option + "pmcbk"}>
          {console.log(
            "CustomMultiCheckBox_defaultValue_valueExist",
            option,
            defaultValues?.indexOf(option),
            defaultValues
          )}
          <Input
            placeholder={option}
            type="checkbox"
            required={props.required}
            readOnly={props.readOnly}
            name={props.name + "mcbk"}
            key={props.name + "mcb" + option}
            id={option}
            value={option}
            checked={selectedValues?.indexOf(option) >= 0 ? true : false}
            onChange={(e) => {
              onCheckBoxSelect(e, props.type);
            }}
          />
          <>{option}</>
          <br />
        </p>
      ))}
    </>
  );
}

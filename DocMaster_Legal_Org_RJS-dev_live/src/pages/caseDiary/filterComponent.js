import { useEffect, useState } from "react";

function FilterComponent({
  orgName,
  orgCases,
  orgClients,
  orgAdvocates,
  handleChildFiltering,
  handleFiltering,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState(null);

  const filterOptions = [
    { value: "org", label: "Organization - " + orgName },
    { value: "clients", label: "Clients" },
    { value: "cases", label: "Cases" },
    { value: "advocates", label: "Advocates" },
  ];

  useEffect(
    function () {
      if (selectedOption) {
        let dropDown;
        if (selectedOption === "clients") {
          const options = orgClients.map((each) => ({
            id: each.user.id,
            type: "client",
            name: each.user.name,
          }));
          dropDown = {
            name: "Client",
            options,
          };
        }
        if (selectedOption === "cases") {
          const options = orgCases.map((each) => ({
            id: each.id,
            type: "case",
            name: each.title,
          }));
          dropDown = {
            name: "Case",
            options,
          };
        }
        if (selectedOption === "advocates") {
          const options = orgAdvocates.map((each) => ({
            id: each.id,
            type: "advocate",
            name: each.name,
          }));
          dropDown = {
            name: "Advocate",
            options,
          };
        }
        setSelectedDropdown(dropDown);
      }
    },
    [selectedOption, orgAdvocates, orgCases, orgClients]
  );

  const handleChildDropdown = (e) => {
    if (e.target.value.length > 0) {
      const { id, type } = JSON.parse(e.target.value);
      handleChildFiltering({ id, type });
    } else {
      handleFiltering();
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-3 row  filter-cmpnt">
        <div className="  col-md-5">
          <div className="row  pe-1 my-1">
            <label className="px-0 col-md-3 align-content-center">
              Filter By:
            </label>
            <select
              className=" col-md-9  "
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setSelectedDropdown(null);
                handleFiltering();
              }}
              placeholder="Select a filter method..."
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-7">
          {selectedDropdown && selectedDropdown !== null && (
            <div className="row   my-1">
              <label className="col-md-5 px-0 align-content-center">
                Filter By Slelecting a {selectedDropdown.name}:
              </label>
              <select
                className="col-md-7 "
                onChange={handleChildDropdown}
                key={selectedDropdown.name}
              >
                <option value="">Select a {selectedDropdown.name}</option>
                {selectedDropdown.options.map((option) => (
                  <option key={option.id} value={JSON.stringify(option)}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterComponent;

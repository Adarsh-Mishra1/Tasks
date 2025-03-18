//AllFeatureDataTable.table.js
import React from "react";

import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useSortBy,
} from "react-table";
// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  customPlaceHolder,
}) {
  // const count = preGlobalFilteredRows.length;
  const count = preGlobalFilteredRows && preGlobalFilteredRows.length;

  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span style={{color:"black"}}>
      <label className="search-label" style={{fontSize:'1rem'}}>Search:{" "}</label>
      <input
        className="form-control search-input"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={
          customPlaceHolder !== null ? customPlaceHolder : `${count} records...`
        }
      />
    </span>
  );
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      className="form-control"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function Table({ columns, data, customPlaceHolder }) {
  const defaultColumn = React.useMemo(
    () => ({
      // Default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter, filters },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageSize: 50 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        customPlaceHolder={customPlaceHolder}
      />
      <div className="table-responsive table-container">
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {/* <th>S.No</th> */}
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={row.original.isPastDate ? "table-secondary" : ""}
              >
                {/* <td>{pageIndex * pageSize + i + 1}</td> */}
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")} </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <br />
      {/* <div>Showing the first 20 results of {page.length} rows</div> */}
      <div >
        <pre style={{ display: "none" }}>
          <code>{JSON.stringify(filters, null, 2)}</code>
        </pre>
      </div>
      <ul className="pagination w-100">
        <li
          className="page-item"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <a className="page-link"><i class="fa fa-angle-double-left" aria-hidden="true"></i></a>
        </li>
        <li
          className="page-item"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <a className="page-link"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
        </li>
        <li>
          <a className="page-link">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </a>
        </li>
        <li style={{display:'inline-flex',paddingLeft:'0px',paddingRight:'0px'}}>
          <a className="" style={{ padding:'0px' }}> 
            <input
              className="form-control text-center"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "30px",paddingLeft:'0px',paddingRight:'0px',textAlign:'center' }}
            />
          </a>
        </li> 
        <li>
        <select
          className="form-control"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ width: "80px" }}
        >
          {[50, 100, 200, 300, 400, 500].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        </li>
        <li
          className="page-item"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <a className="page-link"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
        </li>
        <li
          className="page-item"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <a className="page-link"><i class="fa fa-angle-double-right" aria-hidden="true"></i></a>
        </li>
        
      </ul>
    </div>
  );
}

function AllFeatureDataTable(props) {
  return (
    <Table
      columns={props.columns}
      data={props.data}
      customPlaceHolder={
        props.customPlaceHolder ? props.customPlaceHolder : null
      }
    />
  );
}
export default AllFeatureDataTable;

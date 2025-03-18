import React from "react";

function PrintDataTable({ columns, data, tableRef, deleteAccessor }) {
  const filterdColumns = columns.filter(
    (column) => column.accessor !== deleteAccessor
  );

  return (
    <div className="table-responsive table-container">
    <table className="table" id="contentToPrint" ref={tableRef}>
      <thead>
        <tr>
          {filterdColumns.map((col) => (
            <th key={col.accessor}>{col.Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id || index}>
            {filterdColumns.map((col) => (
              <td key={col.accessor}>
                {col.accessor === "sno" ? index + 1 : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default PrintDataTable;

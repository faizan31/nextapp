// utils/tableHelpers.js

// Get unique month-year headers
{/*export const getUniqueHeaders = (data) => {
  return Array.from(new Set(data.map(item => `${item.mmonth}-${item.fyear}`)));
}

// Transform data into row format
export const transformDataToRows = (data) => {
  return data.reduce((acc, curr) => {
    if (!acc[curr.aname]) acc[curr.aname] = {};
    acc[curr.aname][`${curr.mmonth}-${curr.fyear}`] = curr.pamount;
    return acc;
  }, {});
}

// Render table rows
export const renderTableRows = (data) => {
  const rowsData = transformDataToRows(data);
  const headers = getUniqueHeaders(data);
  
  return Object.entries(rowsData).map(([aname, row], idx) => (
    <tr key={idx}>
      <td className="border px-4 py-2">{aname}</td>
      {headers.map((header) => (
        <td key={header} className="border px-4 py-2 text-right">
          {row[header] || "-"}
        </td>
      ))}
    </tr>
  ));
} *}
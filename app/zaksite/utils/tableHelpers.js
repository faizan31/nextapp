

export const getUniqueHeaders = (data,frequency) => {
  //console.log(data)
 //return Array.from(new Set(data.map(item => `${item.period}-${item.fyear}`)));
 // console.log("Generated Headers:", getUniqueHeaders(data));
 const headerSet = new Set();
  
  data.forEach(item => {
    let header;
    switch(frequency) {
      case 'qt_q':
        header = `${item.period}QFY${item.fyear.toString().slice(-2)}`; 
        break;
      case 'hy_h':
        header = `${item.period}HFY${item.fyear.toString().slice(-2)}`;
        break;
      case 'yr_y':
        header = `FY${item.fyear.toString().slice(-2)}`;
        break;
      case 'nm_n':
        header = `9MFY${item.fyear.toString().slice(-2)}`;
        break;
      default:
        header = `${item.period}-${item.fyear}`; // Default fallback
    }
    headerSet.add(header);
  });
  
  return Array.from(headerSet);
};



export const transformDataToRows = (data) => {
  if (!data || data.length === 0) return [];
  
  //const headers = getUniqueHeaders(data);
  
  const rowsMap = {};

  data.forEach(item => {
    const key = `${item.period}-${item.fyear}`;
    if (!rowsMap[item.aname]) {
       rowsMap[item.aname] = { 
        description: item.aname,
        acode:item.acode,
        sname: item.subscrpt,

       };
      
      /*headers.forEach(header => {
        rowsMap[item.aname][header] = null;
      });*/
    }
    const formattedAmount = Number(item.pamount).toLocaleString("en-US");
    rowsMap[item.aname][key] = formattedAmount;
  });

  return Object.values(rowsMap);
};
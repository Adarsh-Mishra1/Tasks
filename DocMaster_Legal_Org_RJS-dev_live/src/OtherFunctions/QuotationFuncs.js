//QuotationFuncs.js
export const processViewForSubQuotationItems = (parentKeyOrId, quoteItems) => {
  let viewToReturn = [];
  // let quoteItemsGroupBy = quotationItemsGroupBy(quoteItems, "parentQuoteId");
  let quoteItemsGroupBy = quotationItemsGroupBy(quoteItems, "quoteId");

  viewToReturn.push(
    <h5 className="quotation-total">
      Quotation Total:{" "}
      {quoteItems.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalPrice,
        0,
      )}
    </h5>,
  );

  console.log("quoteItemsGroupBy_", quoteItemsGroupBy);
  if (Object.keys(quoteItemsGroupBy).length > 0) {
    Object.entries(quoteItemsGroupBy).forEach(([key, value]) => {
      // do something with key and val
      //   console.log("quoteItemsGroupBy_key_value", key, value);
      //   console.log(
      //     "quoteItemsGroupBy_getQuotationFromItemArray_rtn",
      //     key,
      //     getQuotationFromItemArray(key, quoteItems)
      //   );
      viewToReturn.push(
        quotationItemsView(getQuotationFromItemArray(key, quoteItems), value),
      );
    });
  }

  return viewToReturn;
};

export const quotationItemsView = (quotation, quotationItems) => {
  console.log(
    "quoteItemsGroupBy_quotationItemsView_vars",
    quotation,
    quotationItems,
  );
  // let view2return=[];
  let tr2return = [];

  let totalOfItems = quotationItems.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalPrice,
    0,
  );

  quotationItems.map((quotationItem, index) => {
    tr2return.push(
      <tr>
        <td>{index + 1}</td>
        <td>{quotationItem.itemName}</td>
        <td>{quotationItem.unit}</td>
        <td>{quotationItem.price}</td>
        <td>{quotationItem.nos}</td>
        <td className="text-right">{quotationItem.totalPrice}</td>
      </tr>,
    );
  });

  tr2return.push(
    <tr className="table-total-row">
      <td colSpan={4}>Total</td>
      <td colSpan={1}>1</td>
      <td className="text-right">{totalOfItems}</td>
    </tr>,
  );

  return (
    <>
      <h6 className="table-quotation-head">{quotation?.quoteTitle}</h6>
      <p className="table-quotation-details">{quotation?.quoteDetails}</p>
      {/* <br /> */}
      <table
        className="table table-bordered "
        style={{ width: "100%" }}
        id={"#" + quotation?.quoteId + "PriceQuoteTable"}
      >
        <thead>
          <tr>
            <th>S. No</th>
            <th>Item Name</th>
            <th>Unit</th>
            <th>Price</th>
            <th>nos</th>
            <th className="text-right">Item Total</th>
          </tr>
        </thead>
        <tbody>{tr2return}</tbody>
      </table>
    </>
  );
};

export const getQuotationFromItemArray = (quoteId, quotationItems) => {
  /*
    console.log(
    "quoteItemsGroupBy_getQuotationFromItemArray_pre0",
    parentQuoteId,
    quotationItems
  );
  */
  // return quotationItems.find(
  //   (quotationItem) =>
  //     Number(quotationItem.parentQuoteId) === Number(parentQuoteId)
  // );

  return quotationItems.find(
    (quotationItem) => Number(quotationItem["quoteId"]) === Number(quoteId),
  );
};

export function getFilteredQuotationItems(parentKeyOrId, quoteItems) {
  let itemsTempSelected = [];
  //Old
  //   for (var i = 0; i < quoteItems.length; i++) {
  //     if (quoteItems[i].parentQuoteId === parentKeyOrId) {
  //       itemsTempSelected.push(quoteItems[i]);
  //     }
  //   }

  if (quoteItems != null && quoteItems != undefined && quoteItems.length > 0) {
    quoteItems.map((quoteItem) => {
      if (quoteItem.parentQuoteId === parentKeyOrId) {
        itemsTempSelected = [...itemsTempSelected, quoteItem];
      }
    });
  }
  return itemsTempSelected;
}

export let quotationItemsGroupBy = function (xs, key) {
  console.log("quotationItemsGroupBy_xs", xs);
  console.log("quotationItemsGroupBy_key", key);
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

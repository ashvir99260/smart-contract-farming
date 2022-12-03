import React from "react";

function ShowStatus({ data }) {
  if (data?.buyerSigned && data?.sellerSigned) {
    return "Signed by both of the party";
  } else if (data?.buyerSigned) {
    return `Signed by ${data.buyerName}, Sign off required from ${data.sellerName}`;
  } else if (data?.sellerSigned) {
    return `Signed by ${data.sellerName}, Sign off required from ${data.buyerName}`;
  } else {
    return "Sign off required from both party";
  }
}

export default ShowStatus;

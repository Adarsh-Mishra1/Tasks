import React, { Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Receipt = () => {

    
  return (
    <Suspense fallback={<>Loading...</>}>
        <div className="container-fluid py-4"  style={{overflowY:'auto',height:"100vh"}}>
            <div className="row text-black text-16">
                <div className="col-md-12 mb-3">
                    <div className="text-center mb-3">
                        <img src="images/advocate.png" width={80}/>
                        <h4>Name of the Company</h4>
                        <h4>Address</h4>
                        <span className="text-16">Email & Contact Number </span>
                        <h4 className="mt-4  text-b"><b>Receipt of Payment</b></h4>
                    </div>
                </div>
                <div className="col-md-12">
                    <p className="text-16 mb-0">Name:</p>
                    <p className="text-16 mb-0">Address:</p>
                    <p className="mb-4 text-16" style={{borderBottom:"1px solid #000"}}>Email & Contact Number:</p>
                    
                    <p className="text-16 mb-4">Received with thanks a sum of rupees <b>Five Thousend Only(₹5,000.00)</b> from<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>through online transfer towards traveling expenses.</p>

                    <div className="mt-4 pt-4">
                        <p className="text-16 mb-3">For Company Neme</p>
                        <p className="text-16 mb-0">Date : <u>                                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></p>
                         
                    </div>
                </div>
            </div>
        </div>
    </Suspense>
  )
}
export default Receipt;
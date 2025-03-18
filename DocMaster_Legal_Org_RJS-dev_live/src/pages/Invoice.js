import { Table, TableHead } from "@mui/material";
import React, { Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const invoice = () => {

    
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
                        <h4 className="mt-4  text-b"><b>INVOICE</b></h4>
                    </div>
                </div>
                <div className="col-md-12">
                    <p className="mb-4 text-16">Date | </p>
                    <p className="text-16 mb-0">Name:</p>
                    <p className="text-16 mb-0">Address:</p>
                    <p className="mb-3 text-16">Email & Contact Number:</p>
                    <div class="table-responsive mb-4">
                        <table class="table table-bordered table-striped">
                            <tr>
                                <th className="text-start p-2 text-16">S.No</th>
                                <th className="text-center p-2 text-16">Perticulars</th>
                                <th className="text-end p-2 text-16">Amount (₹)</th>
                            </tr>
                            <tr>
                                <td className="p-2 text-16">&nbsp;</td>
                                <td className="p-2 text-16">&nbsp;</td>
                                <td className="p-2 text-16">&nbsp;</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-16">&nbsp;</td>
                                <td className="p-2 text-16">&nbsp;</td>
                                <td className="p-2 text-16">&nbsp;</td>
                            </tr>
                        </table>
                    </div>
                    <p className="text-16 mb-4">For Company Name</p>

                    <div className="mt-4 pt-4">
                        <p className="text-16 mb-0">Note:</p>
                        <p className="text-16 mb-0">Errors and Omissions Excempted</p>
                        <p className="text-16 mb-4">All dues to be cleared within 15 days from the date of invoice </p>
                        
                        <p className="text-16 mb-0">Send Payment To:</p>
                        <p className="text-16 mb-0">Account Holder's Name:</p>
                        <p className="text-16 mb-0">Bank Name:</p>
                        <p className="text-16 mb-0">Account Number & IFSC Code:</p>
                        <p className="text-16 mb-0">PAN Number:</p>
                        <p className="text-16 mb-0">UPI I'd:</p>
                    </div>
                </div>
            </div>
        </div>
    </Suspense>
  )
}
export default invoice;
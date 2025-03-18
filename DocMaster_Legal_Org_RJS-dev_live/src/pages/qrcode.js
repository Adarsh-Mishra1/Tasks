import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function QRcode() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('3540'); // Default amount set to 3540
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  // Function to generate a random transaction ID starting with "DOC"
  const generateRandomTransactionId = () => {
    return `DOC${Math.floor(100000 + Math.random() * 900000)}`; // "DOC" followed by a random 6-digit number
  };

  // Function to fetch the QR code URL
  const fetchQRCodeUrl = async (transactionId, amount) => {
    try {
      const apiUrl = `https://docmaster.in/payment/sample.php?transaction_id=${transactionId}&amount=${amount}`; // Construct the URL
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('API Response:', data);

      // Parse nested data
      const innerData = JSON.parse(data.response);
      const nestedData = JSON.parse(innerData.data);

      if (nestedData && nestedData.success === false && nestedData.message === 'Duplicate transaction ID') {
        // Generate a new transaction ID and retry
        const newTransactionId = generateRandomTransactionId();
        console.log('Duplicate transaction ID. Retrying with:', newTransactionId);
        setTransactionId(newTransactionId); // Update the transaction ID
        await fetchQRCodeUrl(newTransactionId, amount); // Retry with the new transaction ID
        return;
      }

      if (nestedData && nestedData.refId) {
        const otherParams = 'upi://pay?pa=docmaster@icici&pn=Abc';
        const endParams = '&cu=INR&mc=5411';
        setQrCodeUrl(`${otherParams}&tr=${nestedData.refId}&am=${amount}${endParams}`);
      }
    } catch (error) {
      console.error('Error fetching QR code URL:', error);
    }
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  // Generate transaction ID and QR code when the component loads
  useEffect(() => {
    const initialTransactionId = generateRandomTransactionId();
    setTransactionId(initialTransactionId);
    fetchQRCodeUrl(initialTransactionId, amount);
  }, [amount]);

  // Format timer as MM:SS
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="App">
      <h1>QR Code Payment</h1>
      {qrCodeUrl && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Scan to Pay</h2>
          <QRCodeCanvas value={qrCodeUrl} size={256} includeMargin={true} />
          <p>{qrCodeUrl}</p>
          <p>Transaction ID: {transactionId}</p>
          <p>Amount: ₹{amount}</p>
          <p>Expires in: {formatTimer()}</p>
        </div>
      )}
    </div>
  );
}

export default QRcode;

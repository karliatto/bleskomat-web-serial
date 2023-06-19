let serialPort; // Global variable to hold the SerialPort object

// Function to listen for data from the serial port
function listenForData() {
  const reader = serialPort.readable.getReader();

  function read() {
    reader.read()
      .then(({ value, done }) => {
        if (done) return;
        const data = new TextDecoder().decode(value); // Convert received data to text
        console.log('Received data:', data);
        read(); // Continue reading data
      })
      .catch(error => {
        console.error('Error reading data:', error);
      });
  }

  read();
}

// Function to send data to the serial port
function sendData(data) {
  const writer = serialPort.writable.getWriter();
  const encoder = new TextEncoder();
  const dataEncoded = encoder.encode(data); // Convert text data to Uint8Array

  writer.write(dataEncoded)
    .then(() => {
      console.log('Data sent:', data);
      writer.releaseLock();
    })
    .catch(error => {
      console.error('Error sending data:', error);
    });
}

// Function to open the serial port and start listening for data
async function connectToDevice() {
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 }); // Adjust baud rate if necessary
    console.log('Connected to device:', serialPort);
    listenForData(); // Start listening for data
  } catch (error) {
    console.error('Error connecting to device:', error);
  }
}

// Check if Web Serial is supported and run the connection function
if ('serial' in navigator) {
  connectToDevice();
} else {
  console.error('Web Serial not supported in this browser.');
}
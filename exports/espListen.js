
// For debugging purposes
// chrome://device-log/
// chrome://usb-internals/

const filters = [
    { vendorId: 0x10c4, productId: 0xea60 },
    // Add more filters if you have multiple ESP32 devices with different product IDs
];


async function connectToDevice() {
    try {
      const device = await navigator.usb.requestDevice({ filters });
      console.log('device', device);
      await device.open();
    if (device.configuration === null) await device.selectConfiguration(1);
    await device.claimInterface(0);

      // Endpoint configuration (check your ESP32 setup)
      const endpointIn = device.configuration.interfaces[2].endpoints[0];

      // Receive data
      while (true) {
        const result = await device.transferIn(endpointIn.endpointNumber, 64);
        const data = new TextDecoder().decode(result.data.buffer);
        console.log(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  connectToDevice();

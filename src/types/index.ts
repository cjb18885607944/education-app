// types/device.ts
export interface QueryParams {
  deviceName: string;
  status: string;
  ipAddress: string;
  deviceNumber: string;
  serialNumber: string;
  pageNo: number;
  pageSize: number;
}

export interface DeviceInfo {
  name: string;
  status: string;
  ip: string;
  port: string;
}

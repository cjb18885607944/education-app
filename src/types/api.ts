// src/types/api.ts

// 通用响应类型
export interface ActionResult<T = any> {
  code: string;
  msg: string;
  data: T;
}

// 分页请求参数
export interface PageParams {
  pageNo: number;
  pageSize: number;
}

// 分页响应数据
export interface PageResult<T> {
  code: string;
  msg: string;
  data: {
    total: number;
    pages: number;
    pageNo: number;
    pageSize: number;
    list: T[];
  };
}
// 登录
export interface registerReqDto {
  userName: string;
  userDisplayName: string;
  password: string;
  phone: string;
  status: number;
  verificationCode: string;
}
export interface loginReqDto {
  userName: string;
  password: string;
}
export interface resetReqDto {
  verificationCode: string;
  userName: string;
  password: string;
}
export interface sendReqDto {
  phone: string;
}

// 人脸库相关
export interface FaceLibrary {
  modelDataId: string;
  name: string;
  thresholdValue: number;
  studentNum?: number;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}
export interface libraryListReqDto extends PageParams {
  studentNo: string;
}

export interface AddOrUpdateFaceLibrary {
  modelDataId?: string;
  name: string;
  thresholdValue: number;
  remark?: string;
}

// 学生相关
export interface Student {
  modelDataId: string;
  name: string;
  faceLibraryId: string;
  status: number; // 0：启用，1：停用
  studentNo: string;
  facePic: string;
  createTime: string;
  updateTime: string;
}

export interface GetStudentReq extends PageParams {
  name?: string;
  hasFace?: string; // 0：全部，1：录入，2：未录入
  studentNo?: number;
  status?: number;
}

export interface AddOrUpdateStudent {
  modelDataId?: string;
  name: string;
  studentNo: string;
  facePic: string;
}

// 考勤相关
export interface MouthStuAttReqDto {
  faceLibraryId: string;
  studentNo: string;
  mouth: string;
  studentId: string;
}
export interface attPageReqDto extends PageParams {
  faceLibraryName: string;
}

export interface StuAttDetailReqDto extends PageParams {
  faceLibraryId: string;
  status: number;
  studentName: string;
}

export interface attSumReqDto {
  attendanceDate: string;
}

// 设备相关
export interface Equipment {
  modelDataId: string;
  name: string;
  ip: string;
  port: number;
  status: number; // 0：在线，1：离线，2：未检测
  protocol: string;
  user: string;
  password: string;
  equipmentId: string;
  serialNumber: string;
  createTime: string;
  updateTime: string;
}

export interface AddOrUpdateEquipment {
  modelDataId?: string;
  name: string;
  ip: string;
  port?: number;
  protocol?: string;
  user: string;
  password: string;
  equipmentId?: string;
  serialNumber?: string;
}

// 识别计划相关
export interface RecognizePlan {
  modelDataId: string;
  name: string;
  equipmentId: string;
  equipmentName: string;
  faceLibraryId: string;
  faceLibraryName: string;
  successNum: number;
  failNum: number;
  status: number; // 0：未开始，1：下发中，2：已结束
}

export interface AddOrUpdateRecognize {
  modelDataId?: string;
  name: string;
  equipmentId: string;
  faceLibraryId: string;
}

// src/api/index.ts
import request from "@/utils/request";
import { get, post, upload } from "@/utils/request";
import type {
  ActionResult,
  FaceLibrary,
  AddOrUpdateFaceLibrary,
  Student,
  GetStudentReq,
  AddOrUpdateStudent,
  Equipment,
  AddOrUpdateEquipment,
  RecognizePlan,
  AddOrUpdateRecognize,
  PageResult,
  MouthStuAttReqDto,
  attSumReqDto,
  attPageReqDto,
  StuAttDetailReqDto,
  registerReqDto,
  loginReqDto,
  resetReqDto,
  sendReqDto,
  libraryListReqDto,
} from "@/types/api";

// 登录接口
export const loginApi = {
  register: (data: registerReqDto) =>
    post<ActionResult>("/attendance/ui/web/v1/user/register", data),
  send: (data: sendReqDto) =>
    get<ActionResult>("/attendance/ui/web/v1/user/send", data),
  login: (data: loginReqDto) =>
    get<ActionResult>("/attendance/ui/web/v1/user/login", data),
  resetPassword: (data: resetReqDto) =>
    get<ActionResult>("/attendance/ui/web/v1/user/resetPassword", data),
};
// 考勤统计相关接口
export const attendanceStatistics = {
  mouthStuAtt: (data: MouthStuAttReqDto) =>
    post<void>("/attendance/ui/web/v1/attendance/getMouthStuAtt", data),
  attPage: (data: attPageReqDto) =>
    post<void>("/attendance/ui/web/v1/attendance/attendancePage", data),
  stuAttDetail: (data: StuAttDetailReqDto) =>
    post<void>("/attendance/ui/web/v1/attendance/attendanceDetailPage", data),
  StuAttSum: (data: attSumReqDto) =>
    get<void>("/attendance/ui/web/v1/attendance/getAttendanceSum", data),
};

// 人脸库相关接口
export const faceLibraryApi = {
  addOrUpdate: (data: AddOrUpdateFaceLibrary) =>
    post<void>("/attendance/ui/web/v1/faceLibrary/addOrUpdate", data),

  getList: (data: libraryListReqDto) =>
    get<void>("/attendance/ui/web/v1/faceLibrary/getList", data),

  delete: (idList: string) =>
    get<void>("/attendance/ui/web/v1/faceLibrary/delete" + idList),
};

// 学生相关接口
export const studentApi = {
  addOrUpdate: (data: AddOrUpdateStudent) =>
    post<void>("/attendance/ui/web/v1/student/addOrUpdate", data),

  getList: (params: GetStudentReq) =>
    post<PageResult<Student>>("/attendance/ui/web/v1/student/getList", params),

  delete: (idList: string) =>
    get<void>("/attendance/ui/web/v1/student/delete" + idList),

  uploadImage: (file: File) =>
    upload("/attendance/ui/web/v1/student/imageUpLoad", file),
  importStudents: (file: File) =>
    upload("/attendance/ui/web/v1/student/upLoad", file),

  exportStudents: (params: Omit<GetStudentReq, "pageNo" | "pageSize">) =>
    post("/attendance/ui/web/v1/student/downLoad", params, {
      responseType: "blob",
    }),
};

// 设备管理接口
export const equipmentApi = {
  addOrUpdate: (data: AddOrUpdateEquipment) =>
    post<void>("/attendance/ui/web/v1/equipment/addOrUpdate", data),

  getList: (params: any) =>
    post<PageResult<Equipment>>(
      "/attendance/ui/web/v1/equipment/getList",
      params
    ),

  delete: (idList: string) =>
    get<void>("/attendance/ui/web/v1/equipment/delete" + idList),

  importEquipments: (file: File) =>
    upload("/attendance/ui/web/v1/equipment/upLoad", file),

  exportEquipments: (params: any) =>
    post("/attendance/ui/web/v1/equipment/downLoad", params, {
      responseType: "blob",
    }),
};

// 识别计划接口
export const recognizePlanApi = {
  addOrUpdate: (data: AddOrUpdateRecognize) =>
    post<void>("/attendance/ui/web/v1/recognizePlan/addOrUpdate", data),

  getList: (params: any) =>
    post<PageResult<RecognizePlan>>(
      "/attendance/ui/web/v1/recognizePlan/getList",
      params
    ),

  delete: (idList: string) =>
    get<void>("/attendance/ui/web/v1/recognizePlan/delete" + idList),

  batchDelivery: (idList: string[]) =>
    post<void>("/attendance/ui/web/v1/recognizePlan/batchDelivery", idList),
};

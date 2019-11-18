import axiosIns from './axios-ins'
import axiosForm from './axios-form'
import * as url from './url'

export function logout() {
  return axiosIns.get(url.LOG_OUT);
}

export function login(user) {
  return axiosForm.post(url.LOGIN,user);
}
export function isOnline() {
  return axiosIns.get(url.IS_ONLINE);
}

export function getUserList(json) {
  return axiosIns.post(url.GET_USER_LIST,json);
}

export function getUserMessage(json) {
  return axiosIns.post(url.GET_USER_MESSAGES,json);
}

export function getMessage(userId,otherUserId,time,json) {
  return axiosIns.post(url.GET_MESSAGES+"/"+userId+"/"+otherUserId+"/"+time,json);
}


export function getEssay(json) {
  return axiosIns.post(url.GET_ESSAY,json);
}


export function getCommentByEssayId(id,json) {
  return axiosIns.post(url.GET_ESSAY_COMMENT+id,json);
}

export function getEmployeeList(json) {
  return axiosIns.post(url.GET_EMPLOYEE_LIST,json);
}

export function saveUpdateEmployee(json) {
  return axiosIns.post(url.SAVE_UPDATE_EMPLOYEE,json);
}


export function getRoleList(json) {
  return axiosIns.post(url.GET_ROLE_LIST,json);
}

export function saveUpdateRole(json) {
  return axiosIns.post(url.SAVE_UPDATE_ROLE,json);
}

export function roleDelete(id) {
  return axiosIns.get(url.ROLE_DELETE+id);
}

export function employeeDelete(id) {
  return axiosIns.get(url.EMPLOYEE_DELETE+id);
}

export function employeeAssignRole(json) {
  return axiosIns.post(url.EMPLOYEE_ASSIGN_ROLE,json);
}

export function permissionList() {
  return axiosIns.get(url.PERMISSION_LIST);
}

export function assignPerm(json) {
  return axiosIns.post(url.ASSIGN_PERM,json);
}

export function getCommodityList(json) {
  return axiosIns.post(url.GET_COMMODITY_LIST,json);
}

export function saveUpdateCommodity(json) {
  return axiosIns.post(url.SAVE_UPDATE_COMMODITY,json);
}

export function commodityDelete(id) {
  return axiosIns.get(url.COMMODITY_DELETE+id);
}

export function getDictionaryList(json) {
  return axiosIns.post(url.DICTIONARY_LIST,json);
}

export function queryBannerList(json) {
  return axiosIns.post(url.BANNER_LIST,json);
}

export function saveUpdateBanner(json) {
  return axiosIns.post(url.SAVE_UPDATE_BANNER,json);
}

export function bannerDelete(id) {
  return axiosIns.get(url.BANNER_DELETE+id);
}



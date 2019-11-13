import axiosIns from './axios-ins'
import axiosForm from './axios-form'
import * as url from './url'

export function getBannerList() {
    return axiosForm.post(url.BANNER_LIST);
}

export function getCommodityCategoryList4IndexPageList(json) {
    return axiosIns.post(url.COMMODITY_CATEGORY_4INDEX_PAGE_LIST,json);
}

export function getCommoditylist4IndexPageList(json) {
    return axiosIns.post(url.COMMODITY_LIST_4INDEX_PAGE_LIST,json);
}

export function getCommodityCategoryList(json) {
    return axiosIns.post(url.COMMODITY_CATEGORY_LIST,json);
}

export function getUserCart(json) {
    return axiosIns.post(url.USER_CART,json);
}

export function getUserDefaultAddress(json) {
    return axiosIns.post(url.USER_DEFAULT_ADDRESS,json);
}

export function getUserAllAddress(json) {
    return axiosIns.post(url.USER_All_ADDRESS,json);
}

export function getUserAddressById(json) {
    return axiosIns.post(url.USER_ADDRESS_BY_ID,json);
}

export function saveUserAddress(json) {
    return axiosIns.post(url.SAVE_USER_ADDRESS,json);
}

export function getUserInfo(json) {
    return axiosIns.post(url.USER_INFO,json);
}

export function getOrderList(json) {
    return axiosIns.post(url.ORDER_LIST,json);
}

export function userLogin(json) {
    return axiosIns.post(url.USER_LOGIN,json);
}


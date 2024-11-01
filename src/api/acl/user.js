import request from "@/utils/request";

const api_name = "/user";

/*
登陆
*/
export function login({ username, password }) {
  return request({
    url: "/admin/acl/index/login",
    method: "post",
    data: { username, password },
  });
}

/*
获取用户信息(根据token)
*/
export function getInfo() {
  return request({
    url: "/admin/acl/index/info",
    method: "get",
  });
}

/*
登出
*/
export function logout() {
  return request({
    url: "/admin/acl/index/logout",
    method: "post",
  });
}

/* 
获取当前用户的菜单权限列表
*/
export function getMenu() {
  return request("/admin/acl/index/menu");
}

/* 
获取后台用户分页列表(带搜索)
*/
export function getPageList(page, limit, searchObj) {
  return request({
    url: `/user/list?page=${page}&page_size=${limit}`,
    method: "get",
    params: searchObj,
  });
}

/* 
根据ID获取某个后台用户
*/
export function getById(id) {
  return request({
    url: `${api_name}/get/${id}`,
    method: "get",
  });
}

/* 
保存一个新的后台用户
*/
export function add(user) {
  return request({
    url: `${api_name}/add`,
    method: "post",
    data: user,
  });
}

/* 
更新一个后台用户
*/
export function update(user) {
  console.log("aaaaaaaaaa", user);
  return request({
    url: `${api_name}/update`,
    method: "post",
    data: user,
  });
}

/* 
获取某个用户的所有角色
*/
export function getRoles(userId) {
  return request({
    url: `/user/toAssign?id=${userId}`,
    method: "get",
  });
}

/* 
给某个用户分配角色
roleId的结构: 字符串, 'rId1,rId2,rId3'
*/
export function assignRoles(adminId, roleId) {
  return request({
    url: `${api_name}/doAssign`,
    method: "post",
    data: {
      adminId,
      roleId,
    },
  });
}

/* 
批量删除多个用户
ids的结构: ids是包含n个id的数组
*/
export function removeUsers(ids) {
  return request({
    url: `/user/delete`,
    method: "post",
    data: { ids: ids },
  });
}

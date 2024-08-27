import request from '@/utils/request';

export const reqBrandList = (page, limit) => request({
    url: `/product/brand/list?page=${page}&pageSize=${limit}`,
    method: 'get'
});


export const reqAddOrUpdateBrand = (brand) => {
    if (brand.id) {
        return request({
            url: '/product/brand/update',
            method: 'post',
            data: brand
        })
    } else {
        return request({
            url: '/product/brand/create',
            method: 'post',
            data: brand
        })
    }
};

export const reqDeleteBrand = (id) => request({
    url: `/product/brand/del?id=${id}`,
    method: 'get'
});
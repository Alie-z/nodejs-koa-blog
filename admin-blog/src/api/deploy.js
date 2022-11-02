import request from '@/utils/request';

// 设置部署项目
export function deploy(data) {
    return request({
        url: '/deploy',
        method: 'post',
        data
    });
}

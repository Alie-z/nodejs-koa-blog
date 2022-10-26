import { POST } from '../http.js'
import photo from '../urls/photo'

// 获取列表
export function getPhotoList(data) {
  return POST({
    url: photo.list,
    data
  })
}

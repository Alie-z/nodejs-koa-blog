<template>
    <div>
        <input id="fileInput" type="file" name="file" multiple="multiple" />
        <button @click="sliceUpload(0)">串行上传</button>
        <div>
            start:{{ time.start }}--end:{{ time.end }}
            耗时：{{ time.end-time.start }}
        </div>
        <br>
        <br>
        <input id="fileInput1" type="file" name="file" multiple="multiple" />
        <button @click="sliceUpload1(0)">并发上传</button>
        <div>
            start:{{ time.start1 }}--end:{{ time.end1 }}
            耗时：{{ time.end1-time.start1 }}
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'DemoUpload',
    data() {
        return {
            time: {
                start: 0,
                start1: 0,
                end: 0,
                end1: 0
            }
        };
    },
    methods: {
        merge(name){
            axios.post('http://localhost:9000/api/v1/upload/merge', {name}).then(res => {
                console.log(res);
            });
        },
        sliceUpload(index) {
            index === 0 && (this.time.start = Date.now());
            const file = document.getElementById('fileInput').files[0];

            if (!file) return;
            // 文件分片

            let chunkSize = 1024 * 500; // 50KB 50KB Section size
            // [ 文件名, 文件后缀 ]
            const [fname, suffix] = file.name.split('.');
            // 获取当前片的起始字节
            const start = index * chunkSize;
            if (start > file.size) {// 当超出文件大小，停止递归上传
                this.merge(file.name);
                this.time.end = Date.now();
                return;
            }
            const blob = file.slice(start, start + chunkSize);
            // 为每片进行命名
            const blobName = `${fname}.${index}.${suffix}`;
            const blobFile = new File([blob], blobName);

            const formData = new FormData();
            formData.append('file', blobFile);
            axios.post('http://localhost:9000/api/v1/upload/slice', formData).then(res => {
                console.log(res);
                // 递归分片上传
                this.sliceUpload(++index);
            });
        },
        sliceUpload1() {
            this.time.start1 = Date.now();
            const file = document.getElementById('fileInput1').files[0];
            console.log('🚀 > sliceUpload > file', file);
            if (!file) return;
            // [ 文件名, 文件后缀 ]
            const [fname, suffix] = file.name.split('.');
            // 文件分片
            let size = 1024 * 500; // 分片大小设置
            let fileChunks = [];
            let index = 0;        // 分片序号
            for (let cur = 0; cur < file.size; cur += size) {
                fileChunks.push({
                    hash: index++,
                    blob: file.slice(cur, cur + size)
                });
            }
            const that = this;
            const uploadFileChunks = async function (list){
                if (list.length === 0){
                    // 所有分片上传完成，通知如无
                    that.merge(file.name);
                    that.time.end1 = Date.now();
                    return;
                }
                let pool = [];       // 并发池
                let max = 3;         // 最大并发数
                let finish = 0;      // 完成数量
                let failList = [];   // 失败列表
                for (let i = 0;i < list.length;i++){
                    let item = list[i];
                    const blobName = `${fname}.${item.hash}.${suffix}`;
                    const blobFile = new File([item.blob], blobName);
                    let formData = new FormData();
                    formData.append('file', blobFile);
                    let task = axios.post('http://localhost:9000/api/v1/upload/slice', formData).then(res => {
                        // console.log('🚀 > task > res', i, '>>', res);
                    });
                    task.then(data=>{
                        // 从并发池中移除已经完成的请求
                        let index = pool.findIndex(t=> t === task);
                        pool.splice(index);
                    }).catch(()=>{
                        failList.push(item);
                    }).finally(()=>{
                        finish++;
                        // 如果有失败的重新上传
                        if (finish === list.length){
                            uploadFileChunks(failList);
                        }
                    });
                    pool.push(task);
                    if (pool.length === max){
                        // Promise.race 赛跑，哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。
                        await Promise.race(pool);
                    }
                }
            };
            uploadFileChunks(fileChunks);
        }
    }
};
</script>

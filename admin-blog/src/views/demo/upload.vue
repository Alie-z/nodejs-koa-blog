<template>
    <div>
        <input id="fileInput" type="file" name="file" multiple="multiple" />
        <button @click="sliceUpload(0)">上传</button>

        <form action="http://localhost:9000/api/v1/upload/slice" method="post" enctype="multipart/form-data">
            <input id="file" type="file" name="file" value="" multiple="multiple" />
            <input type="submit" value="提交" />
        </form>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'DemoUpload',
    data() {
        return {};
    },
    mounted() {
        this.$axios = axios.create({withCredentials: false});
    },
    methods: {
        merge(name){
            axios.post('http://localhost:9000/api/v1/upload/merge', {name}).then(res => {
                console.log(res);
            });
        },
        sliceUpload(index) {
            const that = this;
            const file = document.getElementById('fileInput').files[0];

            if (!file) return;
            // 文件分片

            let chunkSize = 1024 * 500; // 50KB 50KB Section size
            // [ 文件名, 文件后缀 ]
            const [fname, fext] = file.name.split('.');
            // 获取当前片的起始字节
            const start = index * chunkSize;
            if (start > file.size) {// 当超出文件大小，停止递归上传
                this.merge(file.name);
                return;
            }
            const blob = file.slice(start, start + chunkSize);
            // 为每片进行命名
            const blobName = `${fname}.${index}.${fext}`;
            const blobFile = new File([blob], blobName);

            const formData = new FormData();
            formData.append('file', blobFile);
            axios.post('http://localhost:9000/api/v1/upload/slice', formData).then(res => {
                console.log(res);
                // 递归分片上传
                this.sliceUpload(++index);
            });


            // let fileChunks = [];

            // let index = 0;        // Section num

            // for (let cur = 0; cur < file.size; cur += size) {
            //     fileChunks.push({
            //         hash: index++,
            //         chunk: file.slice(cur, cur + size)
            //     });
            // }


            // let pool = []; // Concurrent pool

            // let max = 3; // Maximum concurrency

            // for (let i = 0; i < fileChunks.length; i++) {

            //     let item = fileChunks[i];
            //     let formData = new FormData();
            //     formData.append('file', item);
            //     // 上传分片
            //     let task = that.$axios({
            //         method: 'post',
            //         url: 'http://localhost:9000/api/v1/upload/slice',
            //         data: formData
            //     });

            //     task.then(() => {
            //         // 从并发池中移除已经完成的请求
            //         let index = pool.findIndex(t => t === task);

            //         pool.splice(index);

            //     });
            //     // 把请求放入并发池中，如果已经达到最大并发量
            //     pool.push(task);
            //     if (pool.length === max) {
            //         // All requests are requested complete
            //         await Promise.race(pool);

            //     }

            // }


        }
    }
};
</script>

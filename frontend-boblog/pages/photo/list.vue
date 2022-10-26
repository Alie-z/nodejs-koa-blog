<template>
    <div class="content">
        <ul
            v-if="photoList && photoList.length > 0"
            v-infinite-scroll="getPhotoList"
            class="ul-wrap"
            style="overflow:auto">
            <li
                v-for="(item, index) in photoList"
                :key="item.id"
                :class="`content-list ${index % 2 !== 0 && 'list-margin'}`"
                @click="handlePreview(item.id,item.num)">
                <img :src="item.imgSrc.replace('tjg','pic')" alt="" />
                <div class="num-tag">{{ item.num }}</div>
                <div class="title">{{ item.title }}</div>
            </li>
        </ul>
        <el-empty v-else description="暂无数据"></el-empty>
        <photo-preview :id="photoId" :num="photoNum" :is-show="isShow" @close="setPreview"></photo-preview>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {getPhotoList} from '@/request/api/photo';
import tagData from '@/lib/tag';
import PhotoPreview from '@/components/photo/Preview';

export default {
    name: 'PhotoIndex',
    components: {
        PhotoPreview
    },
    async asyncData(context) {
        const {kw, page = 1} = context.query;
        const params = {
            kw,
            page
        };
        const [err, res] = await getPhotoList(params);
        const {hasMore, data} = res.data;
        if (!err) {
            return {
                photoList: data,
                hasMore,
                page,
                kw
            };
        }
    },
    data() {
        return {
            tagData,
            activeCollapse: '热门',
            activeTag: null,
            isShow: false,
            photoId: null,
            photoNum: null
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        })
    },

    mounted() {},
    methods: {
        handlePreview(id, num) {
            this.isShow = true;
            this.photoId = id;
            this.photoNum = num;
        },
        setPreview(msg){
            this.isShow = msg;
        },
        async getPhotoList(){
            console.log('load', this.page);
            if (this.hasMore){
                this.page++;
                const params = {
                    kw: this.kw,
                    page: this.page
                };
                const [err, res] = await getPhotoList(params);
                if (!err) {
                    const {hasMore, data} = res.data;
                    this.photoList = [...this.photoList, ...data];
                    this.hasMore = hasMore;
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .content {
        .ul-wrap {
            height: calc(100vh - 56px);
            display: flex;
            flex-wrap: wrap;
            padding: 0 12px;
            .content-list {
                width: 176px;
                min-height: 176px;
                display: flex;
                flex-direction: column;
                margin: 0 10px 10px 0;
                position: relative;
                border-radius: 5px;
                overflow: hidden;
                background: rgba(0,0,0,0.1);

                img {
                    width: 100%;
                }
                .num-tag {
                    position: absolute;
                    top: 10px;
                    left: 0;
                    height: 20px;
                    width: 36px;
                    color: #fff;
                    border-radius: 0 20px 20px 0;
                    text-align: center;
                    background: rgba(0,0,0,0.5);
                }
                .title {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    color: #fff;
                    word-wrap: break-word;
                    word-break: break-all;
                }
            }
            .list-margin {
              margin-right: 0;
            }
        }
    }
</style>

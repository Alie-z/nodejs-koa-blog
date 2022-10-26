<template>
  <div class="content">
        <ul v-if="photoList && photoList.length > 0" class="ul-wrap">
            <li
                v-for="(item, index) in photoList"
                :key="item.id"
                :class="`content-list ${index % 2 !== 0 && 'list-margin'}`"
            >
                <!-- <img :src="item.imgSrc.replace('tjg','pic')" alt="" /> -->
                <div class="num-tag">{{item.num}}</div>
                <div class="title">{{item.title}}</div>
            </li>
        </ul>
            <div v-else class="empty-data">
      暂无数据
      <a v-if="isClear" href="/">清空搜索条件</a>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {getPhotoList} from '@/request/api/photo';
import tagData from '@/lib/tag';

export default {
    name: 'PhotoIndex',
    async asyncData(context) {
        const {kw, page} = context.query;
        const params = {
            kw,
            page
        };
        const [err, res] = await getPhotoList(params);
        const {hasMore, data} = res.data;
        if (!err) {
            return {
                photoList: data,
                hasMore
            };
        }
    },
    data() {
        return {
            tagData,
            activeCollapse: '热门',
            activeTag: null
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        })
    },

    mounted() {
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleTag(val) {
            this.activeTag = val;
        }
    }
};
</script>

<style scoped lang="scss">
    .content {
        .ul-wrap {
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

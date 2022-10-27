<template>
    <div class="response-wrap content">
        <el-tabs v-model="activeCollapse" @tab-click="handleClick">
            <el-tab-pane v-for="item in tagData.classify" :key="item" :name="item" :label="item">
                <div v-for="tag in Object.keys(tagData.tagClass[item])" :key="tag" class="tag-wrap">
                    <el-tag
                        type="info"
                        round
                        :effect="tag === activeTag ? 'plain':'light'"
                        @click="handleTag(tag)">
                        {{ tag }}
                    </el-tag>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import tagData from '@/lib/tag';

export default {
    name: 'PhotoIndex',
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
    // async fetch({ store }) {
    //   await store.dispatch('category/getCategoryData')
    // },
    mounted() {
    },
    methods: {
        handleClick(tab) {
            console.log(tab);
        },
        handleTag(val) {
            this.activeTag = val;
            this.$router.push({path: '/photo/list', query: {kw: tagData.tagAll[val]}});
        }
    }
};
</script>

<style scoped lang="scss">
    .content {
        width: 100%;
        .tag-wrap {
            display: inline-flex;
            padding: 10px 5px 0;
        }
    }
</style>

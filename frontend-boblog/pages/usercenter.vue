<template>
    <div>
        <div v-if="userInfo" class="userinfo">
            <p>昵称：{{ userInfo.username }}</p>
            <p>邮箱：{{ userInfo.email }}</p>
            <p style="text-indent: 2em">
                —— 假如生活欺骗了你，请你不要放弃，坚持下去！天是不会给绝路你的！
            </p>
            <el-button @click="logout"> 退出登录 </el-button>

            <div
                v-if="Array.isArray(commentList) && commentList.length > 0"
                class="comment">
                <h2>评论列表：</h2>
                <ul class="comment-list">
                    <li v-for="item in commentList" :key="item.id" class="comment-item">
                        <p>文章：{{ item.article.title }}</p>
                        <p>评论内容：{{ item.content }}</p>
                        <p>评论时间：{{ item.created_at }}</p>
                        <p>回复：{{ item.reply_list || '无' }}</p>
                    </li>
                </ul>
                <div class="pagination">
                    <el-pagination
                        :current-page="page"
                        background
                        layout="total, prev, pager, next"
                        :total="count"
                        @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {getCommentTarget} from '@/request/api/comment';
import {removeToken} from '@/lib/auth';

export default {
    name: 'UserCenter',
    data() {
        return {
            page: 1,
            count: 0,
            commentList: []
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo
        })
    },
    async fetch({store}) {
        await store.dispatch('category/getCategoryData');
    },
    head() {
        return {
            title: `${
                this.userInfo && this.userInfo.username
            } - 个人中心  `,
            meta: [
                {
                    name: 'keywords',
                    content:
            'Aliez,博客,Aliez博客,bo,blog,boblog,前端开发工程师,前端性能优化,JavaScript,css,html'
                },
                {
                    name: 'description',
                    content: 'Aliez博客 ，专注于前端开发技术，前端性能优化！'
                }
            ]
        };
    },
    mounted() {
        this.getComment();
    },
    methods: {
    // 退出登录
        logout() {
            removeToken();
            this.$store.commit('user/SET_LOGIN_STATUS', false);
            this.$store.commit('user/SET_USERINFO', null);
            this.$router.push('/');
        },
        async getComment() {
            const uid = this.userInfo && this.userInfo.id;
            console.log('🚀 > getComment > this.userInfo', this.userInfo);
            const [err, res] = await getCommentTarget({
                user_id: uid,
                is_replay: 1,
                is_article: 1,
                page: this.page
            });
            if (!err) {
                this.isLoad = true;
                this.commentList = res.data.data.data;
                this.count = res.data.data.meta.count;
            }
        },
        // 点击数字
        async handleCurrentChange(page) {
            this.page = page;
            await this.getComment();
            this.$scrollTo(0);
        }
    }
};
</script>

<style scoped lang="scss">
.userinfo {
  width: 1024px;
  margin: 32px auto;
  font-size: 14px;
}
.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>

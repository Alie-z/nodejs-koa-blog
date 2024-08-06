<template>
  <div class="response-wrap footer">
    <div class="site">
      <span>© Aliez博客</span>
      <span>17512018620@163.com</span>
    </div>
    <div class="site">
      <a style="color: #fff" href="https://beian.miit.gov.cn/" target="_blank">
        滇ICP备2024032825号-2
      </a>
    </div>

    <div v-show="!isShow" class="icon close" @click="$router.go(-1)">
      <i class="el-icon-back"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "FooterIndex",
  computed: {
    ...mapState({
      isShow: (state) => state.photo.isShow,
    }),
  },
};
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: space-between;
  margin: 120px auto 64px;
  text-align: center;
  .icon {
    display: none;
  }
}
.site {
  font-size: 14px;
  color: #666666;
}
.site span {
  margin-right: 24px;
}
.copyright {
  &-link {
    font-size: 14px;
    color: #666666;
    text-decoration: none;
  }
}

@media screen and (max-width: 540px) {
  .footer {
    flex-direction: column;
    margin: 32px auto;
    .icon {
      position: fixed;
      bottom: 0;
      width: 80px;
      height: 80px;
      z-index: 101;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
    }
  }
  .copyright {
    margin-top: 10px;
  }
}
</style>

<template>
    <div class="response-wrap footer">
        <div class="site">
            <span>© Aliez博客</span>
            <span>17512018620@163.com</span>
        </div>
        <div class="icon close" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FooterIndex'
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

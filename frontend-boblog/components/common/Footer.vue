<template>
  <div class="response-wrap footer">
    <div class="site">
      <span>© Aliez博客</span>
      <span>17512018620@163.com</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterIndex',
}
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: space-between;
  margin: 120px auto 64px;
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
  }
  .copyright {
    margin-top: 10px;
  }
}
</style>

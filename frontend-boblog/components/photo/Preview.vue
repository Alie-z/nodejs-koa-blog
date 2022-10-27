<template>
    <div v-show="isShow" class="preview-wrap">
        <el-carousel ref="imgCarousel" height="100vh"
                     indicator-position="none"
                     direction="vertical" :autoplay="false" arrow="always">
            <el-carousel-item v-for="item in num*1" :key="item">
                <el-image
                    style="height: 100%;"
                    :src="`https://pic.gzhuibei.com/a/1/${id}/${item + 1}.jpg`"
                    fit="cover"></el-image>
            </el-carousel-item>
        </el-carousel>
        <div class="icon close" @click="close">
            <i class="el-icon-close"></i>
        </div>
        <div class="icon prev" @click="prev">
            <i class="el-icon-arrow-up"></i>
        </div>
        <div class="icon next" @click="next">
            <i class="el-icon-arrow-down"></i>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PhotoPreview',
    props: {
        id: {
            type: String,
            default: () => {}
        },
        num: {
            type: String,
            default: () => {}
        },
        isShow: {
            type: Boolean,
            default: () => {
                return true;
            }
        }
    },
    emits: ['close'],
    data(){
        return {

        };
    },
    methods: {
        close() {
            this.$emit('close', false);
        },
        prev() {
            this.$refs.imgCarousel.prev();
        },
        next() {
            this.$refs.imgCarousel.next();
        }
    }
};
</script>
<style lang='scss'>
  .preview-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background: rgba(0,0,0,0.5);
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
    .prev {
      right: 0;
      bottom: 80px;
    }
    .next {
      right: 0;
    }

  }
</style>

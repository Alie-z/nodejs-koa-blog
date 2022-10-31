<template>
    <div v-show="isShow" class="preview-wrap">
        <el-carousel ref="imgCarousel" height="100vh"
                     indicator-position="none"
                     direction="vertical" :autoplay="false" arrow="always">
            <el-carousel-item v-for="item in num*1" :key="item">
                <div class="image-wrap">
                    <div class="img-index">{{ item }}/{{ num }}</div>
                    <el-image
                        style="width: 100%;"
                        :src="`https://pic.gzhuibei.com/a/1/${id}/${item}.jpg`"
                        fit="cover"></el-image>
                </div>
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
import {mapState} from 'vuex';
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
        }
    },
    data(){
        return {};
    },
    computed: {
        ...mapState({
            isShow: state => state.photo.isShow
        })
    },
    methods: {
        close() {
            this.$store.commit('photo/SET_PHOTO_IS_SHOW', false);
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
    background: rgba(0,0,0,0.9);
    .image-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        .img-index {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 20px;
            background: rgba(0,0,0,0.7);
            color: #ccc;
            text-align: center;
            border-radius: 0 0 5px 5px;
        }
    }
    .icon {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 80px;
      z-index: 101;
      display: flex;
      align-items: center;
      font-size: 30px;
      color: #ccc;
      left: 15px;
    }
    .prev {
      bottom: 80px;
    }
    .close {
      bottom: 160px;
    }

  }
</style>

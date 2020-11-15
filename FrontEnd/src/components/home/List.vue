<template>
  <el-row :gutter="30">
    <el-col :span="4" v-for="(el, i) in seller" :key="i" class="mb-3">
      <el-card :body-style="{ padding: '0px' }">
        <img
          :src="
            $store.state.server + 'static/avatars/avatar-' + el.id + '.png'"
          class="image"
        />
        <div style="padding: 10px">
          <span>{{ el.name }}</span>
          <div class="bottom clearfix">
            <time class="time">{{ el.bio }}</time>
            <el-button class="mt-2" type="primary" @click="$router.push('/id/'+el.id)" plain
              >Vào xem</el-button
            >
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      seller: [],
    };
  },
  created() {
    this.axios
      .get("user/allSellers")
      .then((res) => {
        this.seller = res.data.data.sellers;
      })
      .catch(function (e) {
        console.log(e);
      });
  },
};
</script>
<template>
  <!--  -->
  <div class="p-2">
    <div>
      <div v-for="message in messages" :key="message">
        <!-- Notification -->
        <el-row
          v-if="message.userID == 'adminNoti'"
          type="flex"
          class="mb-2"
          justify="center"
        >
          <el-col :span="18">
            <el-alert
              :title="message.text"
              type="info"
              center
              :closable="false"
              show-icon
            >
            </el-alert>
          </el-col>
        </el-row>
        <!-- Other -->
        <el-row v-else-if="message.userID != userID" class="mb-2">
          <el-card class="box-card" style="width: 480px">
            <div>
              <el-avatar :size="'small'" :src="o_userAvatar"></el-avatar>
            </div>
            <div class="text item">
              {{ message.text }}
            </div>
          </el-card>
        </el-row>
        <!--User -->
        <el-row v-else type="flex" class="mb-2" justify="end">
          <el-card class="box-card" style="width: 480px">
            <div>
              <el-avatar :size="'small'" :src="userAvatar"></el-avatar>
            </div>
            <div class="text item">
              {{ message.text }}
            </div>
          </el-card>
        </el-row>
      </div>
      <el-input type="textarea" :rows="2" v-model="showMessage"> </el-input>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button class="mt-1" type="primary" icon="el-icon-s-promotion" @click="sendMessage" plain
          >Gửi</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import fire from "./fire.js";
export default {
  data() {
    return {
      roomHash: "",
      userID: this.$store.state.userInfo.id,
      o_userID: this.$route.params.id,

      userAvatar:
        this.$store.state.server +
        "static/avatars/avatar-" +
        this.$store.state.userInfo.id +
        ".png",
      o_userAvatar:
        this.$store.state.server +
        "static/avatars/avatar-" +
        this.$route.params.id +
        ".png",

      name: null,
      o_name: null,

      showMessage: "",
      messages: [],
    };
  },
  watch: {
    async "$store.state.noti"() {
      if (this.$store.state.noti == "") return;
      const message = {
        text: this.$store.state.noti,
        userID: "adminNoti",
      };
      fire
        .database()
        .ref("chatrooms/" + this.roomHash)
        .push(message);
      this.showMessage = "";
    },
    messages: {
      handler: function () {
        console.log(this.messages[this.messages.length - 1].userID)
        if (this.messages[this.messages.length - 1].userID == "adminNoti")
          this.updateBill();
      },
      deep: true,
    },
  },
  methods: {
    sendMessage() {
      if (this.showMessage != "") {
        const message = {
          text: this.showMessage,
          userID: this.userID,
        };
        fire
          .database()
          .ref("chatrooms/" + this.roomHash)
          .push(message);
        this.showMessage = "";
      }
    },
    updateBill() {
      let url = "/bill/other/" + this.$route.params.id;
      if (this.$store.state.billID != "") {
        url = "/bill/" + this.$store.state.billID;
      }
      console.log(url);
      this.axios
        .get(url)
        .then((res) => {
          if (
            this.$store.state.userInfo.role == "seller" ||
            res.data.data.bill.status <= 5
          ) {
            this.$store.state.billID = res.data.data.bill._id;
            this.$store.state.bill = res.data.data.bill.items;
            this.$store.state.dis = res.data.data.bill.chargeInfo.totalDiscount;
            this.$store.state.step = res.data.data.bill.status;
          } else this.$store.state.bill = [];
        })
        .catch(function (e) {
          console.log(e);
        });
    },
  },
  mounted() {
    this.axios
      .post(
        "/user/getHashForChatRoom",
        JSON.stringify({
          firstId: this.$route.params.id,
          secondId: this.$store.state.userInfo.id,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            crossDomain: true,
          },
        }
      )
      .then((res) => {
        this.roomHash = res.data.hash;
        let viewMessage = this;
        const itemsRef = fire.database().ref("chatrooms/" + res.data.hash);
        itemsRef.on("value", (snapshot) => {
          let data = snapshot.val();
          let messages = [];
          Object.keys(data).forEach((key) => {
            messages.push({
              id: key,
              userID: data[key].userID,
              text: data[key].text,
            });
          });
          viewMessage.messages = messages;
        });
      })
      .catch((e) => {});
  },
  computed: {
    mess() {
      return this.messages;
    },
  },
};
</script>
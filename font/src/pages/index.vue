<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { copyToClip } from "~/tool";

const dataStr = ref("");
const dialogVisible = ref(false);
const dialogOrderLunchVisible = ref(false);
const lunchList = ref([] as string[]);
const userSelectedList = ref([] as string[]); // 用户所选餐品
const personList = ref([] as string[]); // 点餐的用户列表
const userName = ref("");

dataStr.value = "花生焖猪脚、青椒肉丝、梅菜扣肉、烧鸭、土豆蒸排骨、爆炒猪肝、青椒炒鸡蛋、红萝卜炒肉、水蒸蛋、西红柿炒蛋、腐竹炒肉、茄子豆角、冬瓜肉沫、上海青";

const inputTodayHandler = () => {
  dialogVisible.value = true;
};
const orderLunchHandler = () => {
  dialogOrderLunchVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
};
const submitHandler = () => {
  personList.value = [];
  lunchList.value = dataStr.value.replaceAll(" ", "").split("、");
  dialogVisible.value = false;
};
const submitOrderHandler = () => {
  if (!userName.value) return ElMessage({ type: "error", message: "请输入名称" });
  if (userSelectedList.value.length !== 3) return ElMessage({ type: "error", message: "请选择3个菜品" });
  personList.value.push(`${userName.value}:${userSelectedList.value.join("+")}`);

  dialogOrderLunchVisible.value = false;
  userSelectedList.value = [];
  userName.value = "";
};
const toggleLunchHanlder = (item: string) => {
  // 当前已经选满3个菜，并且还在选没选择的菜，直接返回
  if ((userSelectedList.value.length >= 3) && !userSelectedList.value.includes(item)) return;
  if (userSelectedList.value.includes(item)) {
    const index = userSelectedList.value.indexOf(item);
    userSelectedList.value.splice(index, 1);
  }
  else {
    userSelectedList.value.push(item);
  }
};
// 用户取消点餐
const cancelHandler = (item: string) => {
  ElMessageBox.confirm(
    "请确定这是你的单?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(() => {
    const index = personList.value.indexOf(item);
    if (index !== -1) {
      personList.value.splice(index, 1);
      ElMessage({ type: "success", message: "取消点餐成功！" });
    }
  }).catch(() => {});
};

// 复制点餐人员---给店家
const copyLunchPersonHandler = () => {
  const personOrder = personList.value.map(item => item.split(":")[1]);
  copyToClip(personOrder);
};
// 复制点餐人员信息---自己的微信群用
const copyWechatHandler = () => {
  const list = personList.value.map((item, index) => item.replace(":", ` (${index + 1}号) :`));
  copyToClip(list);
};

</script>

<template>
  <div>
    <div class="btns" style="margin-bottom: 15px; display: flex; justify-content: center;">
      <el-button type="wraning" @click="inputTodayHandler">输入今日菜品</el-button>
      <el-button type="primary" @click="orderLunchHandler">我要点餐</el-button>
      <el-button type="primary" @click="copyLunchPersonHandler">复制点餐信息</el-button>
      <el-button type="primary" @click="copyWechatHandler">复制微信信息</el-button>
    </div>
    <h3>今日菜品</h3>
    <div class="today-list">
      <el-tag v-for="(item) in lunchList" :key="item" class="tag" size="large" type="">{{ item }}</el-tag>
    </div>

    <h3>当前已点餐人员</h3>
    <div class="person-list">
      <div v-for="item in personList" :key="item" style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <span style="margin-right: 100px;">{{ item }}</span>
        <el-button type="danger" @click="cancelHandler(item)">我不点了</el-button>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="今日菜品"
      width="600px"
      :before-close="handleClose"
    >
      <el-input v-model="dataStr" type="textarea" rows="5" style="width: 500px;" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHandler">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogOrderLunchVisible"
      title="点餐：选三个菜"
      width="30%"
    >
      <div class="wrap">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <span style="width: 100px;">姓名：</span>
          <el-input v-model="userName" />
        </div>
        <el-tag
          v-for="(item) in lunchList"
          :key="item"
          size="large"
          class="tag"
          :effect="userSelectedList.includes(item) ? 'light' : 'plain'"
          :type="userSelectedList.includes(item) ? 'success' : 'info'"
          @click="toggleLunchHanlder(item)"
        >
          {{ item }}
        </el-tag>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogOrderLunchVisible = false">取消</el-button>
          <el-button type="primary" @click="submitOrderHandler">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.tag {
  margin-right: 10px;
}
.wrap{
  .tag {
    margin-bottom: 8px;
    cursor: pointer;
  }
}
</style>

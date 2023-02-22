# 项目规划书

组员：

---

选题四：我的音乐台

小组成员：郭冠男（组长），李金星，孟珺逸，王浩哲

## 前后端交互方案

所有 JSON 数据通过 `127.0.0.1:1200` 端口获得，所有音乐与图片数据通过 `127.0.0.1:8000` 端口获得。

### 接口代码示例

请将下文代码引入 `页面.js` 前部。

```js
function SendHttpRequest(PageItem, DominName, Port, Datas, TidyFunction) {
  PageItem.setData({
    httpRetObj: "{}"
  })
  wx.request({
    url: 'http://' + DominName + ':' + Port,
    method: 'POST',
    header: { 
      'Content-Type': 'text/json',
    },
    data: Datas,
    success: function(res) {
      if(JSON.parse) {
        PageItem.setData({
          httpRetObj: res.data
        })
        console.log("请求数据成功");
        console.log(PageItem.data.httpRetObj);
        TidyFunction(res.data);
      }
    },
    fail: function() {
      console.log("请求数据失败");
    },
    complete: function() {
      // complete 
    }
  })
}
```

### 参数解释

- PageItem：传入一个 “页面对象” 的 `this` ；

- DominName：传入 `127.0.0.1` 即可；
- Port：传入 `1200` 获取 JSON 对象；
- Datas：要传发送到服务器的请求数据；
- TidyFunction：整理函数，用于对来自服务端的数据进行整理；

## 页面分划

将所有内容分化为四个页面，每人负责一个页面。

### 主页【发现】——tabBar 页面

负责人：李金星

#### 歌曲排行榜【热歌榜】

请求歌曲排行榜

#### 歌曲分类

#### 歌手分类



### 我的【我的】——tabBar 页面

负责人：孟珺逸



### 音乐详情页（得能播放音乐才行）

负责人：郭冠男



### 分类详情页 与 歌手详情页 

负责人：王浩哲



### 检索页面

负责人：郭冠男






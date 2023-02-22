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

请求歌曲排行榜的接口 JSON：

```json
{
    type: "MusicRank",
    count: 获取音乐的最大数量 N
}
```

后台保证反馈的音乐数量**不超过** $N$，但具体获得到的音乐数可能是 $1\sim N$ 中的任意值。

反馈的 JSON：

```json
{
    result: [
        {
            rank: 音乐排名, 
            name: "音乐名称",
            count: 播放数
        },
        ...
    ]
}
```

#### 请求歌曲的缩略信息

请求方式：

```json
{
    type: "MusicShortInfo",
    name: "音乐名称"
}
```

反馈方式：

```json
{
    result: {
        found: true/false, // 表示音乐能否找到
        name: "音乐名称",
        image: "音乐缩略图 URL",
        composer: "音乐作者名字"
    }
}
```

#### 歌曲分类

请求所有歌曲分类的接口 JSON：

```json
{
    type: "Category",
    count: 理想数目
}
```

反馈的 JSON：

```json
{
    result: [
        {
            name: "歌曲分类名称",
            image: "歌曲分类图片 URL",
            count: "歌曲数目"
        }, ...
    ]
}
```

#### 歌手分类

请求所有歌手分类的 JSON：

```json
{
    type: "ComposerType",
    count: 理想数目
}
```

反馈的 JSON:

```json
{
    result: [
        {
            name: "歌手分类名称",
            image: "歌手分类图片 URL",
            count: "歌手数目"
        }, ...
    ]
}
```

### 我的【我的】——tabBar 页面

负责人：孟珺逸



### 音乐详情页（得能播放音乐才行）

负责人：郭冠男



### 分类详情页 与 歌手详情页 

负责人：王浩哲

#### 请求某一分类下的全部歌曲

request

```json
{
    type: "MusicInCategory",
    count: 理想数目
}
```

response

```json
{
    result: [
        {
            name: "音乐名称",
            image: "音乐封面图片 URL",
            composer: "音乐作者"
        }, ...
    ]
}
```

### 检索页面

负责人：郭冠男

#### 检索歌曲

匹配不只匹配歌曲名称，还匹配作者和风格。

```json
{
    type: 'SearchMusic',
    match: '用户输入的内容'
    count: 理想检索数目
}
```

服务端响应：

```json
{
    result: [
        {
            name: '歌曲名称',
            composer: '歌曲作者',
            image: '歌曲图片 URL'
        }, ...
    ]
}
```


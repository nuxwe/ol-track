# ol-track

ol-track基于`ol`v6以上版本,实现在地图中车辆及人员轨迹的回放,使用之前请确认ol版本。
tips: leave a message in Github
### 安装
```
npm install ol-track
```
### 使用
```
import olTrack from "ol-track";
const olTrack = new olTrack({map:map});
```
### Event
|事件名|说明|传值类型|默认值|
|---|---|---|---|
|start|开始运动|-|-|
|stop|停止运动|-|-|
|setSpeed|设置运动速度|Number|100|
|setRoute|设置运动路线|Array|[]|
|moveStart|回到起点|-|-|
|getClickFeature|获取点数据|Object|-|
|addPopup|向地图中添弹窗|HTML|-|
### 关于
- [Github](https://github.com/nuxwe)
- [demo](https://nuxwe.github.io/ol-track-demo/)


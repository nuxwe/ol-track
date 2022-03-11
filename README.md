# ol-track

ol-track基于`ol`v6以上版本,实现在地图中车辆及人员轨迹的回放,使用之前请确认ol版本。
tips: 需要什么新功能可到GITHUB仓库留言
### 安装
```
npm install ol-track
```
### 使用
```
import olTrack from "ol-track";
const oltrack = new olTrack({map:map});
```
### 方法
```
 * pamars{option}
 * event
 * startAnimation:运动
 * stopAnimation:停止
 * setSpeed:设置速度
 * setNewRoute:重新设置路线
 * moveStart:回到起点
 * getClickFeature:获取点数据
 * addPopup:向地图中添弹窗
```
### 关于
- [Github](https://github.com/webnewshow/ol-track)
- [demo](http://www.ctrippay.com)


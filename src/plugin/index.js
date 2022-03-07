/**
 * 保证OL版本在V6以上
 * pamars{option}
 * event             说明                    传递type              callback
 * startAnimation    运动
 * stopAnimation     停止
 * setSpeed          设置速度                 Number
 * setNewRoute       重新设置路线             []
 * moveStart         回到起点
 * getClickFeature   获取点数据                                    点击点的所有数据
 * addPopup          向地图中添弹窗           {}                   返回弹窗实例
 */

// 依赖于 OL
import Feature from "ol/Feature";
import VectorLayer from "ol/layer/Vector";
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import VectorSource from "ol/source/Vector";
import { LineString, Point } from "ol/geom";
import { Style, Stroke, Icon, Circle, Fill } from "ol/style";
import { getVectorContext } from "ol/render";
import moveImage from "./fly.png";
import home from "./home.png";
class olTrack {
  constructor(option) {
    this.map = option.map;// 地图实列
    this.speedInput = option.speed || 100;// 速度
    this.routeCoords = option.routeCoords || [];// 路线数组
    this.lineColor = option.lineColor || 'red';// 路线颜色
    this.lineWidth = option.lineWidth || 6;// 路线颜色
    this.moveType = option.moveType || 'back'; // 运动方式 back 往返  cycle 循环   once 一次
    this.moveImage = option.moveImage || './fly.png';
    this.route;
    this.styles;
    this.vectorLayer;
    this.routeFeature;
    this.startMarker;
    this.endMarker;
    this.position;
    this.geoMarker;
    // 点
    this.distance = 0;
    this.lastTime;
    this.lastCoords;
    this.movefn;
    // 运动状态
    this.animating = false;
    // 点击状态是否存在
    this.selectSingleClick;
    this.initMA();
  }
  // 初始化
  initMA() {
    if (!this.routeCoords.length) {
      return false;
    }
    this.styles = {
      route: new Style({
        stroke: new Stroke({
          width: this.lineWidth,
          color: this.lineColor,
        }),
      }),
      home: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: home,
          scale: 0.2,
        }),
      }),
      geoMarker: new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: moveImage,
          scale: 0.1,
        }),
      }),
      icon: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({
            color: "blue",
            width: 2,
          }),
        }),
      }),
    };
    let routerList = [];
    if (!Array.isArray(this.routeCoords[0])) {
      // 处理数组
      const routerList = this.routeCoords.map(item => {
        return [item.lat || item.latitude, item.lon || item.longitude];
      });
      routerList.push(routerList);
    } else {
      routerList = this.routeCoords;
    }
    this.route = new LineString(routerList);
    const routeList = this.route.getCoordinates();
    this.routeFeature = new Feature({
      type: "route",
      geometry: this.route,
    });
    const features = routeList.map((item, index) => {
      return new Feature({
        type: 'icon',
        geometry: new Point(item),
        typenem: routerList[index],
      });
    });
    // console.log(features);
    this.position = features[0].getGeometry().clone();
    this.geoMarker = new Feature({
      type: "geoMarker",
      geometry: this.position,
    });
    features.push(this.routeFeature);
    features.push(this.geoMarker,);
    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
      style: (feature) => {
        return this.styles[feature.get("type")];
      },
    });
    this.map.addLayer(this.vectorLayer);
  }
  // 移动
  moveFeature(event) {
    const speed = Number(this.speedInput);
    const time = event.frameState.time;
    const elapsedTime = time - this.lastTime;
    this.distance = (this.distance + (speed * elapsedTime) / 1e6) % 2;
    this.lastTime = time;
    const currentCoordinate = this.route.getCoordinateAt(
      this.distance > 1 ? 2 - this.distance : this.distance
    );
    // 是否循环this.
    if (this.distance > 1.001) {
      if (this.moveType === 'cycle') {
        this.distance = 0;
      }
      if (this.moveType === 'once') {
        this.stopAnimation();
        this.distance = 0;
        return false;
      }
    }
    // 计算角度
    if (this.lastCoords) {
      const x = this.lastCoords[0] - currentCoordinate[0];
      const y = this.lastCoords[1] - currentCoordinate[1];
      const rotation = Math.atan2(y, x);
      this.styles.geoMarker.getImage().setRotation(-rotation);
    }
    this.lastCoords = currentCoordinate;
    this.position.setCoordinates(currentCoordinate);
    const vectorContext = getVectorContext(event);
    vectorContext.setStyle(this.styles.geoMarker);
    vectorContext.drawGeometry(this.position);
    this.map.render();
  }
  // 运动
  startAnimation() {
    if (!this.animating) {
      this.lastTime = Date.now();
      this.movefn = this.moveFeature.bind(this);
      this.vectorLayer.on("postrender", this.movefn);
      this.geoMarker.setGeometry(null);
      this.animating = !this.animating;
    } else {
      console.log("车辆已经处于运动状态");
    }
  }
  // 停止
  stopAnimation() {
    if (this.animating) {
      this.geoMarker.setGeometry(this.position);
      this.vectorLayer.un("postrender", this.movefn);
      this.animating = !this.animating;
    } else {
      console.log("车辆已经处于停止状态");
    }
  }
  // 修改速度
  setSpeed(val) {
    this.speedInput = Number(val);
  }
  // 改变路线
  setNewRoute(val) {
    this.routeCoords = val;
    this.moveStart();
  }
  // 回到起点
  moveStart() {
    this.map.removeLayer(this.vectorLayer);
    this.distance = 0;
    this.animating = false;
    this.initMA();
  }
  // 获取点击点的数据
  getClickFeature(cb) {
    // 点击事件
    if (!this.selectSingleClick) {
      this.selectSingleClick = new Select();
      this.map.addInteraction(this.selectSingleClick);
    }
    this.selectSingleClick.on('select', (e) => {
      if (e.selected.length && e.selected[0].get('typenem')) {
        cb(e.selected[0].get('typenem'));
      }
    });
  }
  // 向地图中添加弹窗事件
  addPopup(option, cb) {
    const dom = document.createElement("div");
    dom.className = "popip";
    dom.insertAdjacentHTML("beforeend", option.el);
    const marker = new Overlay({
      position: option.position,
      element: dom,
      offset: option.offset,
    });
    this.map.addOverlay(marker);
    document.querySelector(`.${option.btn}`).addEventListener("click", () => {
      cb(marker);
    });
  }
}
export default olTrack;

<template>
  <div class="content">
    <div id="map" />
    <div class="btnGroup">
      <button @click="setSpeed(500)">加速</button>
      <button @click="setSpeed(100)">减速</button>
      <button @click="startAnimation">运动</button>
      <button @click="stopAnimation">停止</button>
      <button @click="moveStart">回到起点</button>
      <button @click="addPopup">添加弹窗</button>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import { Tile as TileLayer } from "ol/layer";
import olTrack from "../plugin";
export default {
  name: "Map",
  data() {
    return {
      map: "",
      oltrack: "",
      center: [116.406138, 39.933425],
    };
  },
  mounted() {
    this.map = new Map({
      target: document.getElementById("map"),
      view: new View({
        center: this.center,
        zoom: 13,
        minZoom: 2,
        maxZoom: 19,
        projection: "EPSG:4326",
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
            tileSize: 512,
          }),
        }),
      ],
    });
    this.oltrack = new olTrack({
      map: this.map,
      routeCoords: [
        [116.406138, 39.933425],
        [116.372924, 39.932457],
        [116.32915, 39.931799],
        [116.290698, 39.925217],
        [116.351295, 39.866479],
        [116.374473, 39.870224],
        [116.374614, 39.889345],
      ],
    });
    this.oltrack.getClickFeature(res=>{
      alert(`点击信息：${res}`);
    })
  },
  methods: {
    stopAnimation() {
      this.oltrack.stopAnimation();
    },
    startAnimation() {
      this.oltrack.startAnimation();
    },
    setSpeed(val) {
      this.oltrack.setSpeed(val)
    },
    moveStart() {
      this.oltrack.moveStart()
    },
    addPopup() {
      this.oltrack.addPopup({
        el:`<span class="close">点我关闭弹窗</span>`,
        btn: 'close',
        position: [116.372924, 39.932457],
      },res=>{
        this.map.removeOverlay(res);
      })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  width: 100%;
  height: 100vh;
  position: relative;
}
#map {
  width: 100%;
  height: 100%;
}
.btnGroup {
  position: absolute;
  top: 10px;
  right: 10px;
}
button{
  background: #fff;
  padding: 5px 16px;
  margin: 0px 5px;
}
</style>

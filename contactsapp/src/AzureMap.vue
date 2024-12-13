<template>
  <div :id="mapId" style="height: 100%; width: 100%;"></div>
</template>

<script>
import * as atlas from "azure-maps-control";

export default {
  name: "AzureMap",
  props: {
    mapId: {
      type: String,
      default: "azure-map",
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    zoom: {
      type: Number,
      default: 0,
    },
    subscriptionKey: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      const map = new atlas.Map(this.mapId, {
        center: [this.longitude, this.latitude],
        zoom: this.zoom,
        style: "road",
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: this.subscriptionKey,
        },
      });

      map.events.add("ready", () => {
        const marker = new atlas.HtmlMarker({
          position: [this.longitude, this.latitude],
          text: "📍",
        });
        map.markers.add(marker);
      });
    },
  },
};
</script>

<style scoped>
  #azure-map {
    border: 1px solid #ccc;
    border-radius: 8px;
  }
</style>

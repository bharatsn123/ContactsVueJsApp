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
      // Create a new Azure Map instance
      const map = new atlas.Map(this.mapId, { 
        center: [this.longitude, this.latitude], // Set the initial center of the map using provided longitude and latitude
        zoom: this.zoom, 
        style: "road", // Define the map's visual style 
        authOptions: {
          authType: "subscriptionKey", // Specify the authentication method (using a subscription key here)
          subscriptionKey: this.subscriptionKey,
        },
      });

      // Add an event listener for the "ready" event, triggered when the map finishes loading
      map.events.add("ready", () => {
        // Create a new marker using Azure Maps' HtmlMarker feature
        const marker = new atlas.HtmlMarker({
          position: [this.longitude, this.latitude], 
          text: "📍", 
        });

        // Add the marker to the map
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

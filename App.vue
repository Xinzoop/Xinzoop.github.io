<template>
  <div class="container custom-container">
    <h2>Task Roller</h2>
    <ul class="nav nav-tabs nav-justified">
      <li class="nav-item" v-for="shop in shops" :key="shop.id">
        <a
          :href="'#' + shop.id"
          class="nav-link"
          :class="{'active': shop.id == activeShopId}"
          @click="setActive(shop)"
        >{{shop.name}}</a>
      </li>
    </ul>
    <div class="tab-content py-3" id="myTabContent">
      <ShopView
        class="tab-pane fade"
        :class="{'active show' : shop.id == activeShopId}"
        v-for="shop in shops"
        :key="shop.id"
        :id="shop.id"
        :shop="shop"
      />
    </div>
  </div>
</template>

<script>
import ShopView from "./components/ShopView.vue";
import Shops from "./json/shops.json";

export default {
  components: { ShopView },
  mounted() {
    this.shops = Shops;
    this.activeShopId = this.shops[0].id;
  },
  data() {
    return {
      activeShopId: "",
      shops: []
    };
  },
  methods: {
    setActive(shop) {
      this.activeShopId = shop.id;
    }
  }
};
</script>

<style scoped>

div.custom-container {
  max-width: 1400px;
}

</style>

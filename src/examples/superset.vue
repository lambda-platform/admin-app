<template>
  <div>
    <portal to="header-left">
      <div class="page-title float-left">
        <div class="float-left pt-3">
          <h1 class="text-gray-700 dark:text-gray-200 text-base m-0 ">Шуурхай удирдлага</h1>
          <h2 class="text-gray-400 text-xs m-0"><span>Шуурхай удирдлага</span></h2>
        </div>
      </div>
    </portal>
    <div id="supersetContainer"></div>
  </div>
</template>
<script>
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "~/plugins/core/axios";
export default {
  name: 'SupersetDashboard',
  methods:{
    async  loginAndGetDashboardData(id) {
      try {
        const data = {
          password: 'embed',
          provider: 'db',
          refresh: true,
          username: 'embed'
        };

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://analytic.test.mn/api/v1/security/login',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(data)
        };

        const response = await axios(config);


        try {
          const data = {
            user: {
              username: 'embed',
              first_name: 'embed',
              last_name: 'embed'
            },
            resources: [
              {
                type: 'dashboard',
                id: id
              }
            ],
            rls: []
          };

          const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://analytic.test.mn/api/v1/security/guest_token/',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + response.data.access_token, // Replace with your actual access token
            },
            data: JSON.stringify(data)
          };

          const response2 = await axios(config);

          return response2.data.token;
        }
        catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async initDashboard(id){
      const token  = await this.loginAndGetDashboardData(id);

      await embedDashboard({
        id: id, // given by the Superset embedding UI
        supersetDomain: "https://analytic.test.mn",
        mountPoint: document.getElementById("supersetContainer"), // any html element that can contain an iframe
        fetchGuestToken: () => token,
        dashboardUiConfig: { // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
          hideTitle: true,
          filters: {
            expanded: false,
          }
        },
      });
    }

  },
  mounted() {
    this.initDashboard("xxx");
  },
};
</script>
<style lang="scss">
#supersetContainer{
  width: 100%;
  height: calc(100vh - 100px);
  iframe{
    width: 100%;
    height: calc(100vh - 100px);
  }
}

</style>

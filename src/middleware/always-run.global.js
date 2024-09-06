import {userInfo} from "~/store/useSiteSettings";
import { notification } from 'ant-design-vue';
export default defineNuxtRouteMiddleware((to, from) => {
    const securePaths = new Set([
        "/select-role",
        "/admin",
    ]);

    const firstRoute = getFirstRoute(to)
    const fromFirstRoute = getFirstRoute(from)
    if (securePaths.has(firstRoute)) {
        if(userInfo.value === null){
            notification["warning"]({
                message: 'Нэвтэрнэ үү',
                description: 'Систем ашиглахын тулд систем нэвтэрнэ үү !!!',
            });

            if (securePaths.has(fromFirstRoute)) {
                return navigateTo("/");
            } else {
                return navigateTo(from.fullPath);
            }

        }
    }
})

const getFirstRoute = (routerPath)=>{
    let endIndex = routerPath.fullPath.indexOf('/', 1); // Find second slash
    endIndex = endIndex === -1 ? undefined : endIndex; // If not found, take whole string

    return routerPath.fullPath.slice(0, endIndex);
}

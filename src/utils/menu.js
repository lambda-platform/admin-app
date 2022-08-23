

export const getItemPath = (item)=>{
  if(item.hasOwnProperty('children')){
   if(item.children.length >= 1){
     return item.id;
   } else {
     if(item.link_to == "noAction" || item.link_to == "divider"){
       return item.id;
     } else {
       return getRouterLink(item);
     }
   }
  } else {
    if(item.link_to == "noAction" || item.link_to == "divider"){
      return item.id;
    } else {
      return getRouterLink(item);
    }
  }

}

export const getRouterLink = (item)=>{
  return item.link_to == 'link' || item.link_to == 'router-link' ? item.url : `/admin/p/${item.id}`;
}

export const getMenu = (menu_list, routerPath) =>{

  let index = menu_list.findIndex(m=>getItemPath(m) == routerPath);
  let parentKeys = [];
  if(index >= 1){
    if(menu_list[index].hasOwnProperty("parent")){
      parentKeys = menu_list[index]["parent"].map(p=>{
        return getItemPath(p)
      })
    }
  }
  return parentKeys;
}
export const getTitle = (item, cruds)=> {
  if (item.link_to == 'crud') {
    let crudIndex = cruds.findIndex(crud => crud.id == item.url);
    if (crudIndex >= 0)
      return cruds[crudIndex].title;
    else
      return ''
  } else
    return item.title;
}
export const createList = (menus, parent, cruds) =>{
  let menuList = []

  menus.forEach(m => {

    if(parent){
      let parentParents = [];
      if(parent.hasOwnProperty('parent')){
        parentParents = parent["parent"];
      }
      if(m.hasOwnProperty('parent')){
        m["parent"].push(...parentParents, {
          id:parent.id,
          title:getTitle(parent, cruds),
          link_to: parent.link_to,
          url:parent.url
        })
      } else {
        m["parent"] = [...parentParents, {
          id:parent.id,
          title:getTitle(parent, cruds),
          link_to: parent.link_to,
          url:parent.url
        }]
      }
    }
    let children = [];
    if (m.children !== undefined) {
      if (m.children.length >= 1) {
        children = createList(m.children, m, cruds)
      }
    }
    delete m['children']



    menuList.push(m)
    menuList.push(...children)
  })
  return menuList
}

export const getItemPath = (item, isLevelMenu) => {
  if (item.hasOwnProperty('children')) {
    if (item.children.length >= 1) {
      if (item.link_to === "noActionSubTop" || isLevelMenu) {
        return getItemPath(item.children[0]);
      } else {
        return item.id;
      }
    } else {
      if (item.link_to === "noAction" || item.link_to === "divider") {
        return item.id;
      } else {
        return getRouterLink(item);
      }
    }
  } else {
    if (item.link_to === "noAction" || item.link_to === "divider") {
      return item.id;
    } else {
      return getRouterLink(item);
    }
  }

}

export const getRouterLink = (item) => {
  return item.link_to === 'link' || item.link_to === 'router-link' ? item.url : `/admin/p/${item.id}`;
}

export const getMenu = (menu_list, routerPath) => {

  let index = menu_list.findIndex(m => getItemPath(m) === routerPath);
  let parentKeys = [];
  if (index >= 1) {
    if (menu_list[index].hasOwnProperty("parent")) {
      parentKeys = menu_list[index]["parent"].map(p => {
        return getItemPath(p)
      })
    }
  }
  return parentKeys;
}
export const getTitle = (item, cruds) => {

  if (item.link_to === 'crud') {
    let crudIndex = cruds.findIndex(crud => crud.id === item.url);
    if (crudIndex >= 0)
      return cruds[crudIndex].title;
    else
      return ''
  } else
    return item.title;
}
export const createList = (menus, parent, cruds) => {
  const menuList = [];

  menus.forEach(menu => {
    const {children} = menu;
    if (parent) {
      const parentProps = parent?.parent ?? [];
      menu.parent = [...parentProps, {
        id: parent.id,
        title: getTitle(parent, cruds),
        link_to: parent.link_to,
        url: parent.url,
        sub_top_children: parent.sub_top_children,
      }];
    }

    let subChildren = [];
    if (children && children.length) {
      subChildren = createList(children, menu, cruds);
    }
    delete menu.children;
    menuList.push(menu, ...subChildren);
  });
  return menuList;
};
export const findMenuItemById = (menuItems, id)=>{
  for (let i = 0; i < menuItems.length; i++) {
    const menuItem = menuItems[i];
    if (menuItem.id === id) {
      return menuItem;
    }
    if (menuItem.children && menuItem.children.length > 0) {
      const found = findMenuItemById(menuItem.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

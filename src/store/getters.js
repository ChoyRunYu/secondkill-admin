const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  isShowGoodsDialog: state => state.dialog.isShowGoodsDialog,
  isEditGoods: state => state.dialog.isEditGoods,
  editGoodsId: state => state.dialog.editGoodsId
}
export default getters

const state = {
  isShowGoodsDialog: false,
  isEditGoods: false,
  editGoodsId: 0
}

const mutations = {
  SET_GOODS_DIALOG_IS_SHOW: (state, val) => {
    state.isShowGoodsDialog = val
  },
  SET_IS_EDIT_GOODS: (state, val) => {
    state.isEditGoods = val
  },
  SET_GOODS_ID: (state, val) => {
    state.editGoodsId = val
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

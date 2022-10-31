const state = () => ({
    isShow: false
});

const mutations = {
    SET_PHOTO_IS_SHOW(state, data) {
        state.isShow = data;
    }
};

const actions = {};

export default {
    namespace: true,
    state,
    actions,
    mutations
};

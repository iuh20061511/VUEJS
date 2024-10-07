import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state() {
        return {
            isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
            userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
            loading: false,
            errorMessage: '',
        };
    },
    mutations: {
        setAuthentication(state, status) {
            state.isAuthenticated = status; // Đặt trạng thái xác thực
            localStorage.setItem('isAuthenticated', status); // Lưu vào localStorage
        },
        updateUserInfo(state, data) {
            state.userInfo = {
                token: data.token,
                role_id: data.role_id,
                username: data.user,
                id_user: data.id_user,

            };
            console.log("Updated User Info:", state.userInfo); // Kiểm tra dữ liệu
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo)); // Lưu vào localStorage
        },
        setErrorMessage(state, message) {
            state.errorMessage = message; // Cập nhật thông báo lỗi
        },
        setLoading(state, status) {
            state.loading = status; // Đặt trạng thái loading
        },
    },
    actions: {
        async login({ commit }, userInfo) {
            commit("setLoading", true);
            commit("setErrorMessage", ""); // Reset thông báo lỗi
            try {
                let response = await axios.post("http://127.0.0.1:8000/api/login", userInfo, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                const { success, message, token, role_id, user, id_user } = response.data;

                if (success) {
                    commit("setAuthentication", true); // Đặt trạng thái xác thực
                    commit("updateUserInfo", { token, role_id, user, id_user }); // Cập nhật thông tin người dùng
                    return response.data; // Trả về dữ liệu phản hồi
                } else {
                    commit("setErrorMessage", message); // Cập nhật thông báo lỗi nếu không thành công
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    commit("setErrorMessage", error.response.data.message); // Cập nhật thông báo lỗi từ API
                } else {
                    commit("setErrorMessage", "Có lỗi xảy ra. Vui lòng thử lại."); // Thông báo lỗi chung
                }
                throw error;
            } finally {
                commit("setLoading", false); // Kết thúc trạng thái loading
            }
        },
        logout({ commit }) {
            commit("setAuthentication", false); // Đặt lại trạng thái xác thực
            commit("updateUserInfo", {}); // Xóa thông tin người dùng
            localStorage.removeItem('isAuthenticated'); // Xóa khỏi localStorage
            localStorage.removeItem('userInfo'); // Xóa khỏi localStorage
        },
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        loading: (state) => state.loading,
        errorMessage: (state) => state.errorMessage,
        userInfo: (state) => state.userInfo,
    },
});

export default store;

import axios from "axios";

const API_BASE = "https://customers-backend-yguu.onrender.com/api/customers"; // update to your backend URL

export const customerApi = {
  list: (params) => axios.get(API_BASE, { params }),
  create: (data) => axios.post(API_BASE, data),
  getById: (id) => axios.get(`${API_BASE}/${id}`),
  update: (id, data) => axios.patch(`${API_BASE}/${id}`, data),
  remove: (id) => axios.delete(`${API_BASE}/${id}`),

  addAddress: (id, data) => axios.post(`${API_BASE}/${id}/addresses`, data),
  updateAddress: (id, addressId, data) =>
    axios.patch(`${API_BASE}/${id}/addresses/${addressId}`, data),
  deleteAddress: (id, addressId) =>
    axios.delete(`${API_BASE}/${id}/addresses/${addressId}`),
  markOnlyOneAddress: (id, value) =>
    axios.post(`${API_BASE}/${id}/only-one-address`, { value }),
};

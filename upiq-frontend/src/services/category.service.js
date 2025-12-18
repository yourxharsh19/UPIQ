import api from '../api/axios';

const CategoryService = {
    async getAll() {
        // GET /api/categories
        return api.get('/api/categories');
    },

    async create(categoryData) {
        // POST /api/categories
        // categoryData: { name, type, description }
        return api.post('/api/categories', categoryData);
    },

    async update(id, categoryData) {
        // PUT /api/categories/{id}
        return api.put(`/api/categories/${id}`, categoryData);
    },

    async delete(id) {
        // DELETE /api/categories/{id}
        return api.delete(`/api/categories/${id}`);
    },

    async getByType(type) {
        // GET /api/categories/type/{type}
        // type: "income" or "expense"
        return api.get(`/api/categories/type/${type}`);
    },

    async getById(id) {
        // GET /api/categories/{id}
        return api.get(`/api/categories/${id}`);
    }
};

export default CategoryService;

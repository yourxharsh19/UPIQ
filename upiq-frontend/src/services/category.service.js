import api from './axios';

const CategoryService = {
    async getAll() {
        // GET /api/categories
        return api.get('/categories');
    },

    async create(categoryData) {
        // POST /api/categories
        // categoryData: { name, type, description }
        return api.post('/categories', categoryData);
    },

    async update(id, categoryData) {
        // PUT /api/categories/{id}
        return api.put(`/categories/${id}`, categoryData);
    },

    async delete(id) {
        // DELETE /api/categories/{id}
        return api.delete(`/categories/${id}`);
    },

    async getByType(type) {
        // GET /api/categories/type/{type}
        // type: "income" or "expense"
        return api.get(`/categories/type/${type}`);
    },

    async getById(id) {
        // GET /api/categories/{id}
        return api.get(`/categories/${id}`);
    }
};

export default CategoryService;

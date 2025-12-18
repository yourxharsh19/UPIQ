import api from "./axios";

const TransactionService = {
    getAll: async () => {
        const response = await api.get("/transactions");
        return response.data;
    },

    create: async (transactionData) => {
        const response = await api.post("/transactions", transactionData);
        return response.data;
    },

    getByCategory: async (category) => {
        const response = await api.get(`/transactions/category/${category}`);
        return response.data;
    },

    async update(id, transactionData) {
        // PUT /api/transactions/{id}
        return api.put(`/transactions/${id}`, transactionData);
    },

    async delete(id) {
        // DELETE /api/transactions/{id}
        return api.delete(`/transactions/${id}`);
    },

    async deleteAll() {
        // DELETE /api/transactions
        return api.delete('/transactions');
    }
};

export default TransactionService;

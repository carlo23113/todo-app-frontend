export const state = () => ({
    skipAllQuery: false,
})

export const mutations = () => ({
    skipQuery(value) {
        this.skipAllQuery = value;
    }
})
export const state = () => ({
    skipAllQuery: false,
})

export const mutation = () => ({
    skipAllQuery(value) {
        this.skipAllQuery = value;
    }
})
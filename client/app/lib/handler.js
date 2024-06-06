export const errorBoundary = (func) => {
    return async (req, res) => {
        try {
            await func(req, res);
        } catch(error) {
            throw new Error("Problem!")
        }
    }
}
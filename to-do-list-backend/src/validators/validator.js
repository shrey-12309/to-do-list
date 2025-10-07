const dataValidation = (req, res, next) => {
    const { task, preference, tags, completed } = req.body;
    if (!task || typeof (task) != String) {

    }
}
export { dataValidation }
const dataValidation = (req, res, next) => {
    const { task, preference, tags } = req.body;

    if (!task || typeof task !== 'string') {
        return res.status(400).json({ message: 'Enter a valid task' });
    }
    if (typeof preference !== 'string') {
        return res.status(400).json({ message: 'Enter a valid preference' });
    }
    if (typeof tags !== 'string') {
        return res.status(400).json({ message: 'Enter a valid tag' });
    }

    next();
};

export { dataValidation }
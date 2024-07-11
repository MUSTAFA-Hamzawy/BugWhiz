const validateNotEmpty = (attribute, name) => {
    if (!attribute  || attribute.trim() === '' ) {
        throw new Error(`${name} is required.`);
    }
};


module.exports = {
    validateNotEmpty
};
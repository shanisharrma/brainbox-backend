export default {
    SUCCESS: `The operation has been successful.`, //200
    SOMETHING_WENT_WRONG: `Something went wrong. Please try again later.`, //500
    TOO_MANY_REQUESTS: `Too many request! Please try again later.`, //429

    NOT_FOUND: (entity: string) => `${entity} not found!`, //404
};

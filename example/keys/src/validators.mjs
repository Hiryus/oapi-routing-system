/*
 * This is a list of validation functions called "validator".
 * They are used in the routes definition to constraint parameters.
 *
 * A validator is very basic: it's a function which takes the parameter value and
 * returns an instance or Error in case the value is invalid.
 * If the value looks coorrect, it returns nothing (anything that is not an instance
 * of Error will be ignored and the value considered valid).
 */

/*
 * Very basic email validator.
 *
 * It first ensure the parameter is a string (which is probably unnecessary since any email
 * parameter should declares type "string", but since we cannot know fore sure, let's be paranoid).
 *
 * There it checks if the value looks like an email with a basic regular expression.
 * In real code, you should probably use something more complex, or even better, a dedicated module.
 */
export function email(value) {
    if (typeof value !== 'string') {
        return new Error(`value lust be a string (${typeof value} given)`);
    }
    if (!value.match(/.+@.+\..+/i)) {
        return new Error(`'${value}' is not a valid email`);
    }
}

/*
 * UUID version 4 validator.
 *
 * It first ensure the parameter is a string (which is probably unnecessary since any email
 * parameter should declares type "string", but since we cannot know fore sure, let's be paranoid).
 *
 * There it checks if the value respects the format of an UUIDv4.
 */
export function uuid(value) {
    if (typeof value !== 'string') {
        return new Error(`value lust be a string (${typeof value} given)`);
    }
    if (!value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return new Error(`'${value}' is not a valid uuid-v4`);
    }
}

/*
 * For syntactic sugar, we also export a default object containing all validators.
 */
export default { email, uuid };

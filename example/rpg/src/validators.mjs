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
 * Character class validator.
 *
 * It first ensure the parameter is a string (which is probably unnecessary since the parameter
 * should declares type "string", but since we cannot know fore sure, let's be paranoid).
 *
 * Then it checks if the value is an existing class.
 */
const VALID_CLASSES = ['barbarian', 'monk', 'rogue', 'sorcerer'];
export function dndClass(value) {
    if (typeof value !== 'string') {
        return new Error(`value must be a string (${typeof value} given)`);
    }
    if (!VALID_CLASSES.includes(value)) {
        return new Error(`'${value}' is not a valid D&D class (accepted: ${VALID_CLASSES.join(', ')})`);
    }
}

/*
 * Very basic email validator.
 *
 * It first ensure the parameter is a string (which is probably unnecessary since the parameter
 * should declares type "string", but since we cannot know fore sure, let's be paranoid).
 *
 * Then it checks if the value looks like an email with a basic regular expression.
 * In real code, you should probably use something more complex, or even better, a dedicated module.
 */
export function email(value) {
    if (typeof value !== 'string') {
        return new Error(`value must be a string (${typeof value} given)`);
    }
    if (!value.match(/.+@.+\..+/i)) {
        return new Error(`'${value}' is not a valid email`);
    }
}

/*
 * Maximum length validator for a string.
 *
 * It first ensure the parameter is a string (which is probably unnecessary since the parameter
 * should declares type "string", but since we cannot know fore sure, let's be paranoid).
 *
 * Then it reject the value if its length is strictly superior to the given length.
 */
export function maxLength(length) {
    return (value) => {
        if (typeof value !== 'string') {
            return new Error(`value must be a string (${typeof value} given)`);
        }
        if (value.length > length) {
            return new Error(`'${value}' is too long (maximum: ${length}, given: ${value.length})`);
        }
    };
}

/*
 * Positive number 4 validator.
 *
 * It first ensure the parameter is a number (which is probably unnecessary since the
 * parameter * should declares type "integer" or "number", but since we cannot know
 * for sure, let's be paranoid).
 *
 * Then it checks if the value is strictly postive.
 */
export function positive(value) {
    if (typeof value !== 'number') {
        return new Error(`value must be a number (${typeof value} given)`);
    }
    if (value <= 0) {
        return new Error(`'${value}' is not positive`);
    }
}

/*
 * UUID version 4 validator.
 *
 * It first ensure the parameter is a string (which is probably unnecessary since the parameter
 * should declares type "string", but since we cannot know fore sure, let's be paranoid).
 *
 * Then it checks if the value respects the format of an UUIDv4.
 */
export function uuid(value) {
    if (typeof value !== 'string') {
        return new Error(`value must be a string (${typeof value} given)`);
    }
    if (!value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return new Error(`'${value}' is not a valid uuid-v4`);
    }
}

/*
 * For syntactic sugar, we also export a default object containing all validators.
 */
export default {
    dndClass,
    email,
    maxLength,
    positive,
    uuid,
};

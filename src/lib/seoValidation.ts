/**
 * SEO validation utilities to ensure content meets search engine requirements
 */

/**
 * SEO constraints for content
 */
export const SEO_CONSTRAINTS = {
    TITLE: {
        MIN_LENGTH: 60, // Minimum recommended title length
        MAX_LENGTH: 70, // Maximum recommended title length before truncation
    },
    DESCRIPTION: {
        MIN_LENGTH: 140, // Minimum recommended description length
        MAX_LENGTH: 160, // Maximum recommended description length before truncation
    }
};

/**
 * Validates if a title meets SEO requirements
 * 
 * @param title The title to validate
 * @returns Object containing validation results
 */
export function validateTitle(title: string | undefined | null): {
    valid: boolean;
    length: number;
    tooShort: boolean;
    tooLong: boolean;
    message: string;
} {
    if (!title) {
        return {
            valid: false,
            length: 0,
            tooShort: true,
            tooLong: false,
            message: 'Title is missing'
        };
    }

    const length = title.length;
    const tooShort = length < SEO_CONSTRAINTS.TITLE.MIN_LENGTH;
    const tooLong = length > SEO_CONSTRAINTS.TITLE.MAX_LENGTH;
    const valid = !tooShort && !tooLong;

    const message = valid
        ? `Title is valid (${length} characters)`
        : tooShort
            ? `Title is too short (${length}/${SEO_CONSTRAINTS.TITLE.MIN_LENGTH} characters)`
            : `Title is too long (${length}/${SEO_CONSTRAINTS.TITLE.MAX_LENGTH} characters)`;

    return {
        valid,
        length,
        tooShort,
        tooLong,
        message
    };
}

/**
 * Validates if a description meets SEO requirements
 * 
 * @param description The description to validate
 * @returns Object containing validation results
 */
export function validateDescription(description: string | undefined | null): {
    valid: boolean;
    length: number;
    tooShort: boolean;
    tooLong: boolean;
    message: string;
} {
    if (!description) {
        return {
            valid: false,
            length: 0,
            tooShort: true,
            tooLong: false,
            message: 'Description is missing'
        };
    }

    const length = description.length;
    const tooShort = length < SEO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH;
    const tooLong = length > SEO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH;
    const valid = !tooShort && !tooLong;

    const message = valid
        ? `Description is valid (${length} characters)`
        : tooShort
            ? `Description is too short (${length}/${SEO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH} characters)`
            : `Description is too long (${length}/${SEO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH} characters)`;

    return {
        valid,
        length,
        tooShort,
        tooLong,
        message
    };
}

/**
 * Validates both title and description
 * 
 * @param title The title to validate
 * @param description The description to validate
 * @returns Combined validation results for both title and description
 */
export function validateMetadata(title: string | undefined | null, description: string | undefined | null): {
    valid: boolean;
    title: ReturnType<typeof validateTitle>;
    description: ReturnType<typeof validateDescription>;
} {
    const titleValidation = validateTitle(title);
    const descriptionValidation = validateDescription(description);

    return {
        valid: titleValidation.valid && descriptionValidation.valid,
        title: titleValidation,
        description: descriptionValidation
    };
} 
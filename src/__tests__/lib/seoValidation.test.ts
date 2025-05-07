import {
    validateTitle,
    validateDescription,
    validateMetadata,
    SEO_CONSTRAINTS
} from '@/lib/seoValidation';

describe('SEO Validation', () => {
    describe('validateTitle', () => {
        it('should validate a title with correct length', () => {
            // Exactly 65 characters (between 60-70)
            const title = 'A'.repeat(65);
            const result = validateTitle(title);

            expect(result.valid).toBe(true);
            expect(result.length).toBe(title.length);
            expect(result.tooShort).toBe(false);
            expect(result.tooLong).toBe(false);
        });

        it('should invalidate a title that is too short', () => {
            // 45 characters (less than 60)
            const title = 'A'.repeat(45);
            const result = validateTitle(title);

            expect(result.valid).toBe(false);
            expect(result.length).toBe(title.length);
            expect(result.tooShort).toBe(true);
            expect(result.tooLong).toBe(false);
        });

        it('should invalidate a title that is too long', () => {
            // 80 characters (more than 70)
            const title = 'A'.repeat(80);
            const result = validateTitle(title);

            expect(result.valid).toBe(false);
            expect(result.length).toBe(title.length);
            expect(result.tooShort).toBe(false);
            expect(result.tooLong).toBe(true);
        });

        it('should handle undefined or null title', () => {
            expect(validateTitle(undefined).valid).toBe(false);
            expect(validateTitle(null).valid).toBe(false);
            expect(validateTitle('').valid).toBe(false);
        });

        it('should match exactly at boundary conditions', () => {
            const minTitle = 'A'.repeat(SEO_CONSTRAINTS.TITLE.MIN_LENGTH);
            const maxTitle = 'A'.repeat(SEO_CONSTRAINTS.TITLE.MAX_LENGTH);

            expect(validateTitle(minTitle).valid).toBe(true);
            expect(validateTitle(maxTitle).valid).toBe(true);

            expect(validateTitle('A'.repeat(SEO_CONSTRAINTS.TITLE.MIN_LENGTH - 1)).valid).toBe(false);
            expect(validateTitle('A'.repeat(SEO_CONSTRAINTS.TITLE.MAX_LENGTH + 1)).valid).toBe(false);
        });
    });

    describe('validateDescription', () => {
        it('should validate a description with correct length', () => {
            // Exactly 155 characters (between 150-160)
            const description = 'A'.repeat(155);
            const result = validateDescription(description);

            expect(result.valid).toBe(true);
            expect(result.length).toBe(description.length);
            expect(result.tooShort).toBe(false);
            expect(result.tooLong).toBe(false);
        });

        it('should invalidate a description that is too short', () => {
            // 120 characters (less than 150)
            const description = 'A'.repeat(120);
            const result = validateDescription(description);

            expect(result.valid).toBe(false);
            expect(result.length).toBe(description.length);
            expect(result.tooShort).toBe(true);
            expect(result.tooLong).toBe(false);
        });

        it('should invalidate a description that is too long', () => {
            // 170 characters (more than 160)
            const description = 'A'.repeat(170);
            const result = validateDescription(description);

            expect(result.valid).toBe(false);
            expect(result.length).toBe(description.length);
            expect(result.tooShort).toBe(false);
            expect(result.tooLong).toBe(true);
        });

        it('should handle undefined or null description', () => {
            expect(validateDescription(undefined).valid).toBe(false);
            expect(validateDescription(null).valid).toBe(false);
            expect(validateDescription('').valid).toBe(false);
        });

        it('should match exactly at boundary conditions', () => {
            const minDescription = 'A'.repeat(SEO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH);
            const maxDescription = 'A'.repeat(SEO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH);

            expect(validateDescription(minDescription).valid).toBe(true);
            expect(validateDescription(maxDescription).valid).toBe(true);

            expect(validateDescription('A'.repeat(SEO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH - 1)).valid).toBe(false);
            expect(validateDescription('A'.repeat(SEO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH + 1)).valid).toBe(false);
        });
    });

    describe('validateMetadata', () => {
        it('should validate both title and description when both are valid', () => {
            // Title: 65 characters, Description: 155 characters
            const title = 'A'.repeat(65);
            const description = 'A'.repeat(155);

            const result = validateMetadata(title, description);

            expect(result.valid).toBe(true);
            expect(result.title.valid).toBe(true);
            expect(result.description.valid).toBe(true);
        });

        it('should invalidate when title is invalid', () => {
            // Title: 45 characters (too short), Description: 155 characters (valid)
            const title = 'A'.repeat(45);
            const description = 'A'.repeat(155);

            const result = validateMetadata(title, description);

            expect(result.valid).toBe(false);
            expect(result.title.valid).toBe(false);
            expect(result.description.valid).toBe(true);
        });

        it('should invalidate when description is invalid', () => {
            // Title: 65 characters (valid), Description: 120 characters (too short)
            const title = 'A'.repeat(65);
            const description = 'A'.repeat(120);

            const result = validateMetadata(title, description);

            expect(result.valid).toBe(false);
            expect(result.title.valid).toBe(true);
            expect(result.description.valid).toBe(false);
        });

        it('should invalidate when both title and description are invalid', () => {
            // Title: 45 characters (too short), Description: 120 characters (too short)
            const title = 'A'.repeat(45);
            const description = 'A'.repeat(120);

            const result = validateMetadata(title, description);

            expect(result.valid).toBe(false);
            expect(result.title.valid).toBe(false);
            expect(result.description.valid).toBe(false);
        });
    });
}); 
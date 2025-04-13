import { describe, it, expect } from 'vitest';
import { pascalToSnake, snakeToPascal } from '@/modules/core/utils/core-utils';

describe('Core Utils', () => {
  describe('pascalToSnake', () => {
    it('should convert PascalCase to snake_case', () => {
      expect(pascalToSnake('PascalCase')).toBe('pascal_case');
      expect(pascalToSnake('HelloWorld')).toBe('hello_world');
      expect(pascalToSnake('UserProfileComponent')).toBe('user_profile_component');
    });

    it('should handle single word input', () => {
      expect(pascalToSnake('Hello')).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(pascalToSnake('')).toBe('');
    });
  });

  describe('snakeToPascal', () => {
    it('should convert snake_case to PascalCase', () => {
      expect(snakeToPascal('pascal_case')).toBe('PascalCase');
      expect(snakeToPascal('hello_world')).toBe('HelloWorld');
      expect(snakeToPascal('user_profile_component')).toBe('UserProfileComponent');
    });

    it('should handle single word input', () => {
      expect(snakeToPascal('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(snakeToPascal('')).toBe('');
    });
  });
});

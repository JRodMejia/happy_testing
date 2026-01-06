import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isStrongPassword,
  formatDate,
  calculateTotalTime,
  truncateText,
} from './utils';

describe('Utils - Unit Tests', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should return true for strong passwords', () => {
      expect(isStrongPassword('password123')).toBe(true);
      expect(isStrongPassword('StrongP@ss')).toBe(true);
      expect(isStrongPassword('12345678')).toBe(true);
    });

    it('should return false for weak passwords', () => {
      expect(isStrongPassword('weak')).toBe(false);
      expect(isStrongPassword('1234567')).toBe(false);
      expect(isStrongPassword('')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle different dates', () => {
      const date1 = new Date('2024-12-25');
      const date2 = new Date('2024-06-01');
      
      expect(formatDate(date1)).toBeTruthy();
      expect(formatDate(date2)).toBeTruthy();
      expect(formatDate(date1)).not.toBe(formatDate(date2));
    });
  });

  describe('calculateTotalTime', () => {
    it('should calculate total time correctly', () => {
      expect(calculateTotalTime(10, 20)).toBe(30);
      expect(calculateTotalTime(15, 45)).toBe(60);
      expect(calculateTotalTime(0, 30)).toBe(30);
    });

    it('should handle zero values', () => {
      expect(calculateTotalTime(0, 0)).toBe(0);
      expect(calculateTotalTime(10, 0)).toBe(10);
    });

    it('should handle negative values', () => {
      expect(calculateTotalTime(-5, 10)).toBe(5);
      expect(calculateTotalTime(10, -5)).toBe(5);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe(shortText);
    });

    it('should handle exact length', () => {
      const text = '12345678901234567890';
      expect(truncateText(text, 20)).toBe(text);
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('should handle maxLength of 0', () => {
      expect(truncateText('test', 0)).toBe('...');
    });
  });
});

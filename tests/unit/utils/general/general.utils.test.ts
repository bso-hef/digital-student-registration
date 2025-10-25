import { describe, it, expect } from 'vitest';
import {
  getDisplayFileExtension,
  getFileExtension,
  getFileName,
  toLowerCase,
  fullFileNameWithLowerCaseExtension,
  isValidURL,
  linkify,
} from '@/utils/general.utils';

/**
 * Unit tests for general utility functions
 * @file tests/unit/utils/general/general.utils.test.ts
 */

describe('General Utils', () => {
  describe('getDisplayFileExtension', () => {
    it('should convert plain to txt', () => {
      expect(getDisplayFileExtension('plain')).toBe('txt');
    });

    it('should convert msword mime types to docx', () => {
      expect(getDisplayFileExtension('msword')).toBe('docx');
      expect(
        getDisplayFileExtension(
          'vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ).toBe('docx');
    });

    it('should return the same extension for other mime types', () => {
      expect(getDisplayFileExtension('pdf')).toBe('pdf');
      expect(getDisplayFileExtension('xlsx')).toBe('xlsx');
      expect(getDisplayFileExtension('png')).toBe('png');
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension from filename', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('image.png')).toBe('png');
      expect(getFileExtension('archive.tar.gz')).toBe('gz');
    });

    it('should handle files without extension', () => {
      // When there's no extension, returns the filename itself
      expect(getFileExtension('README')).toBe('README');
    });

    it('should handle files with multiple dots', () => {
      expect(getFileExtension('my.file.name.txt')).toBe('txt');
    });
  });

  describe('getFileName', () => {
    it('should remove file extension from filename', () => {
      expect(getFileName('document.pdf')).toBe('document');
      expect(getFileName('image.png')).toBe('image');
    });

    it('should handle files without extension', () => {
      expect(getFileName('README')).toBe('README');
    });

    it('should handle files with multiple dots', () => {
      expect(getFileName('my.file.name.txt')).toBe('my.file.name');
    });

    it('should handle hidden files', () => {
      // Hidden files like .gitignore have the whole name removed as it's treated as extension
      expect(getFileName('.gitignore')).toBe('');
    });
  });

  describe('toLowerCase', () => {
    it('should convert string to lowercase', () => {
      expect(toLowerCase('HELLO')).toBe('hello');
      expect(toLowerCase('MiXeD CaSe')).toBe('mixed case');
    });

    it('should handle empty string', () => {
      expect(toLowerCase('')).toBe('');
    });

    it('should handle undefined', () => {
      expect(toLowerCase(undefined)).toBe('');
    });

    it('should handle already lowercase string', () => {
      expect(toLowerCase('lowercase')).toBe('lowercase');
    });
  });

  describe('fullFileNameWithLowerCaseExtension', () => {
    it('should lowercase file extension while keeping filename case', () => {
      expect(fullFileNameWithLowerCaseExtension('Document.PDF')).toBe(
        'Document.pdf'
      );
      expect(fullFileNameWithLowerCaseExtension('Image.PNG')).toBe('Image.png');
    });

    it('should handle mixed case extensions', () => {
      expect(fullFileNameWithLowerCaseExtension('file.TxT')).toBe('file.txt');
    });

    it('should preserve filename with multiple dots', () => {
      expect(fullFileNameWithLowerCaseExtension('my.file.name.TXT')).toBe(
        'my.file.name.txt'
      );
    });
  });

  describe('isValidURL', () => {
    it('should return true for valid URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('https://sub.domain.example.com/path')).toBe(true);
      expect(isValidURL('https://example.com/path?query=value')).toBe(true);
      expect(isValidURL('https://example.com:8080/path#hash')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidURL('not a url')).toBe(false);
      expect(isValidURL('example.com')).toBe(false);
      expect(isValidURL('//example.com')).toBe(false);
      expect(isValidURL('')).toBe(false);
      // Note: URL constructor is lenient with protocols, so 'htp://' is actually accepted
    });

    it('should handle URLs with special characters', () => {
      expect(isValidURL('https://example.com/path with spaces')).toBe(true);
      expect(
        isValidURL('https://example.com/path?query=value&other=123')
      ).toBe(true);
    });
  });

  describe('linkify', () => {
    it('should convert URLs to clickable links', () => {
      const text = 'Check out https://example.com for more info';
      const expected =
        'Check out <a href="https://example.com" target="_blank" rel="noreferrer noopener">https://example.com</a> for more info';
      expect(linkify(text)).toBe(expected);
    });

    it('should handle multiple URLs in text', () => {
      const text =
        'Visit https://example.com and http://another.com for details';
      const result = linkify(text);

      expect(result).toContain(
        '<a href="https://example.com" target="_blank" rel="noreferrer noopener">https://example.com</a>'
      );
      expect(result).toContain(
        '<a href="http://another.com" target="_blank" rel="noreferrer noopener">http://another.com</a>'
      );
    });

    it('should not modify text without URLs', () => {
      const text = 'This is just plain text without any URLs';
      expect(linkify(text)).toBe(text);
    });

    it('should handle URLs with query parameters', () => {
      const text = 'Search: https://google.com?q=test&source=web';
      const result = linkify(text);

      expect(result).toContain(
        '<a href="https://google.com?q=test&source=web" target="_blank" rel="noreferrer noopener">'
      );
    });

    it('should handle URLs at the start and end of text', () => {
      const text = 'https://start.com some text https://end.com';
      const result = linkify(text);

      expect(result).toContain('href="https://start.com"');
      expect(result).toContain('href="https://end.com"');
    });

    it('should add target="_blank" and rel attributes for security', () => {
      const text = 'Link: https://example.com';
      const result = linkify(text);

      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noreferrer noopener"');
    });
  });
});

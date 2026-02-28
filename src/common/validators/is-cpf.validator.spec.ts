import { IsCpfConstraint } from './is-cpf.validator';

describe('IsCpfConstraint', () => {
  let validator: IsCpfConstraint;

  beforeEach(() => {
    validator = new IsCpfConstraint();
  });

  it('should validate a valid CPF (numbers only)', () => {
    const validCpf = '52998224725';
    expect(validator.validate(validCpf)).toBe(true);
  });

  it('should validate a valid formatted CPF', () => {
    const validCpf = '529.982.247-25';
    expect(validator.validate(validCpf)).toBe(true);
  });

  it('should invalidate CPF with wrong check digits', () => {
    const invalidCpf = '52998224724';
    expect(validator.validate(invalidCpf)).toBe(false);
  });

  it('should invalidate CPF with all equal numbers', () => {
    const invalidCpf = '11111111111';
    expect(validator.validate(invalidCpf)).toBe(false);
  });

  it('should invalidate CPF with less than 11 digits', () => {
    const invalidCpf = '1234567890';
    expect(validator.validate(invalidCpf)).toBe(false);
  });

  it('should invalidate empty value', () => {
    expect(validator.validate('')).toBe(false);
  });

  it('should return default error message', () => {
    expect(validator.defaultMessage()).toBe('Invalid CPF');
  });
});

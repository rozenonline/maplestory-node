import iconv from 'iconv-lite';

class StringFactory {
  private string: string;
  private encoded: Buffer;
  constructor(string: string) {
    this.setString(string);
  }

  public setString(value: string) {
    this.string = value;
    this.encoded = iconv.encode(value, 'euc-kr');
  }

  get encode() {
    return this.encoded;
  }

  get length() {
    return this.string.length;
  }

  get byteLength() {
    return this.encoded.length;
  }

  toString() {
    return this.string;
  }
}

export default StringFactory;

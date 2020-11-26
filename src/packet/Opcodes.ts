class Opcodes {
  static serverOpcodes = {
    PING: 0x09, // 0x0d
    LOGIN_STATUS: 0x00,
    SERVERLIST: 0x02,
    SERVERSTATUS: 0xff,
    CHARLIST: 0x03,
    SERVER_IP: 0x04,
    CHAR_NAME_RESPONSE: 0x05,
    ADD_NEW_CHAR_ENTRY: 0x06,
    DELETE_CHAR_RESPONSE: 0x07,
    SECONDPW_ERROR: 0x0f
  };

  static clientOpcodes = {
    PONG: 0x0a, // 0x16
    CLIENT_HELLO: 0xff, // 0x01
    LOGIN_PASSWORD: 0x01, // 0x02
    CHARLIST_REQUEST: 0x04,
    CHAR_SELECT: 0x05,
    CHECK_CHAR_NAME: 0x07,
    CREATE_CHAR: 0x08,
    DELETE_CHAR: 0x09,
    CLIENT_ERROR: 0x0b,
    RELOG_REQUEST: 0x0e, // InGame -> Return to Title
    AUTH_SECOND_PASSWORD: 0x0f,
    CHAR_SELECT_WITH_SPW: 0x10
  };

  static getClientOpcodeByValue(value: number) {
    for (const [opcode, v] of Object.entries(Opcodes.clientOpcodes)) {
      if (v === value) return opcode;
    }
    return null;
  }
}

export default Opcodes;

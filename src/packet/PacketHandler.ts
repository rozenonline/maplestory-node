import Client from '../client/client';
import PacketReader from './PacketReader';
import ErrorHandler from '../handlers/ErrorHandler';
import LoginHandler from '../handlers/LoginHandler';
import PongHandler from '../handlers/PongHandler';
import CharacterListRequestHandler from '../handlers/CharacterListRequestHandler';
import CharacterSelectHandler from '../handlers/CharacterSelectHandler';
import CheckCharacterNameHandler from '../handlers/CheckCharacterNameHandler';
import CreateCharacterHandler from '../handlers/CreateCharacterHandler';
import AuthSecondPasswordHandler from '../handlers/AuthSecondPasswordHandler';
import CharacterSelectWithSPWHandler from '../handlers/CharacterSelectWithSPWHandler';
import Opcodes from './Opcodes';
import DeleteCharacterHandler from '../handlers/DeleteCharacterHandler';

interface IOpcodesAndHandlers {
  [opcode: string]: (client: Client, reader: PacketReader) => void;
}

class PacketHandler {
  private static handlers: IOpcodesAndHandlers = {
    PONG: PongHandler, // 핑퐁
    CLIENT_HELLO: null, // 필요없음
    CLIENT_ERROR: ErrorHandler, // 필요없음
    LOGIN_PASSWORD: LoginHandler, // 로그인시
    CHARLIST_REQUEST: CharacterListRequestHandler, // 캐릭터선택창 진입
    CHAR_SELECT: CharacterSelectHandler, // 캐릭터 선택
    CHECK_CHAR_NAME: CheckCharacterNameHandler, // 캐릭터생성 - 닉네임 유효성 확인
    CREATE_CHAR: CreateCharacterHandler, // 캐릭터생성 완료
    DELETE_CHAR: DeleteCharacterHandler, // 캐릭터 삭제
    AUTH_SECOND_PASSWORD: AuthSecondPasswordHandler, // 2차비밀번호 생성
    CHAR_SELECT_WITH_SPW: CharacterSelectWithSPWHandler, // 캐릭터 선택 (2차 비밀번호와 함께)
    RELOG_REQUEST: null // 인게임 -> 로그인창시 (필요없음)
  };

  public static getHandler(opcode: number) {
    const opcodeTitle = Opcodes.getClientOpcodeByValue(opcode);
    if (!opcodeTitle) return null;

    return PacketHandler.handlers[opcodeTitle];
  }
}

export default PacketHandler;

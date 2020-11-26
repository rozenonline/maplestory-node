import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  getManager,
  getConnection
} from 'typeorm';
import Client from '../client/client';
import Account from './Account';
import InventoryItem from './InventoryItem';
import InventorySlot from './InventorySlot';

@Entity()
class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.characters)
  account: Account;

  @Column('tinyint')
  worldId: number;

  @Column({ length: 12 })
  name: string;

  @Column({ type: 'bool', default: false })
  gender: boolean;

  @Column({ type: 'tinyint', unsigned: true, default: 1 })
  level: number;

  @Column({ unsigned: true, default: 0 })
  exp: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  job: number;

  @Column({ unsigned: true, default: 0 })
  meso: number;

  @Column({ default: 0 })
  fame: number;

  @Column({ unsigned: true, default: 0 })
  mapId: number;

  @Column({ type: 'tinyint', default: 0 })
  spawnPoint: number;

  @Column({ type: 'smallint', unsigned: true })
  str: number;

  @Column({ type: 'smallint', unsigned: true })
  dex: number;

  @Column({ type: 'smallint', unsigned: true })
  int: number;

  @Column({ type: 'smallint', unsigned: true })
  luk: number;

  @Column({ type: 'smallint', unsigned: true, default: 50 })
  hp: number;

  @Column({ type: 'smallint', unsigned: true, default: 5 })
  mp: number;

  @Column({ type: 'smallint', unsigned: true, default: 50 })
  maxHp: number;

  @Column({ type: 'smallint', unsigned: true, default: 5 })
  maxMp: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  hpApUsed: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  ap: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  sp: number;

  @Column({ unsigned: true })
  skin: number;

  @Column({ unsigned: true })
  hair: number;

  @Column({ unsigned: true })
  face: number;

  @Column({ type: 'bool', default: false })
  gmLevel: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => InventoryItem, (InventoryItem) => InventoryItem.character)
  inventoryItems: InventoryItem[];

  @OneToOne(() => InventorySlot, (InventorySlot) => InventorySlot.character)
  inventorySlot: InventorySlot;

  private client: Client;

  public setClient(client: Client) {
    this.client = client;
  }

  public static async create(
    client: Client,
    {
      name,
      face,
      hair,
      hairColor,
      skin,
      top,
      bottom,
      shoes,
      weapon,
      str,
      dex,
      int,
      luk
    }
  ): Promise<Character> {
    let character = new Character();
    character.client = client;
    character.worldId = 0;
    character.gender = client.account.gender;
    character.name = name;
    character.face = face;
    character.hair = hair + hairColor;
    character.skin = skin;
    character.str = str;
    character.dex = dex;
    character.int = int;
    character.luk = luk;
    character.account = client.account;
    character = await getManager().save(Character, character);

    // 인벤토리 슬롯 생성
    await InventorySlot.create(character);

    // 기본 아이템 추가
    const items = [
      { id: top, position: -5 },
      { id: bottom, position: -6 },
      { id: shoes, position: -7 },
      { id: weapon, position: -11 }
    ];
    for (const item of items) {
      const ivItem = await InventoryItem.create(
        character,
        -1,
        item.position,
        item.id
      );
    }

    return Character.load(character.id);
  }

  public static async load(id: number) {
    return await getManager().findOne(Character, id, {
      relations: ['inventoryItems', 'inventorySlot']
    });
  }

  // public async save() {
  //   const connection = getConnection();
  //   // 기존 아이템 내역 삭제
  //   await connection
  //     .createQueryBuilder()
  //     .delete()
  //     .from(InventoryDB)
  //     .where('characterId = :id', { id: this.character.id })
  //     .execute();

  //   // 아이템 추가
  //   const insertValues = [];
  //   for (const item of this.items) {
  //     insertValues.push({
  //       itemId: item.itemId,
  //       inventoryType: item.inventoryType,
  //       position: item.position,
  //       characterId: this.character.id
  //     });
  //   }
  //   await connection
  //     .createQueryBuilder()
  //     .insert()
  //     .into(InventoryDB)
  //     .values(insertValues);
  // }
}

export default Character;

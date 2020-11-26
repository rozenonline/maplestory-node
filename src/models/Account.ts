import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  getManager
} from 'typeorm';
import Client from '../client/client';
import Character from './Character';

@Entity()
class Account {
  // DB 컬럼 선언
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
    unique: true
  })
  name: string;

  @Column({
    length: 30
  })
  password: string;

  @Column({
    length: 30,
    nullable: true
  })
  secondpassword: string;

  @Column({ type: 'bool' })
  gender: boolean;

  @Column({ type: 'bool' })
  loggedIn: boolean;

  @Column({ default: 0 })
  cash: number;

  @Column({ default: 0 })
  maplePoint: number;

  @Column({ type: 'bool', default: false })
  banned: boolean;

  @Column({ nullable: true })
  banReason: string;

  @Column({ type: 'bool', default: false })
  gmLevel: number;

  @Column()
  lastIP: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Character, (character) => character.account)
  characters: Character[];

  private client: Client;

  setClient(client: Client) {
    this.client = client;
  }

  public async loadCharacters(worldId: number) {
    this.characters = await getManager().find(Character, {
      where: { account: { id: this.id } },
      relations: ['inventoryItems', 'inventorySlot']
    });
  }
}
export default Account;

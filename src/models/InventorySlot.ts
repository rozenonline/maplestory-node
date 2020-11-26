import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  getManager,
  getRepository,
  JoinColumn
} from 'typeorm';
import Character from './Character';

@Entity()
class InventorySlot {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Character, (character) => character.inventorySlot, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  character: Character;

  @Column({ type: 'tinyint', unsigned: true })
  equip: number;

  @Column({ type: 'tinyint', unsigned: true })
  use: number;

  @Column({ type: 'tinyint', unsigned: true })
  setup: number;

  @Column({ type: 'tinyint', unsigned: true })
  etc: number;

  @Column({ type: 'tinyint', unsigned: true })
  cash: number;

  public static async create(character: Character): Promise<InventorySlot> {
    const ivSlot = new InventorySlot();
    ivSlot.equip = 32;
    ivSlot.use = 32;
    ivSlot.setup = 32;
    ivSlot.etc = 32;
    ivSlot.cash = 60;
    ivSlot.character = character;
    await ivSlot.save();

    return ivSlot;
  }

  public async save() {
    await getManager().save(InventorySlot, this);
  }
}

export default InventorySlot;

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  getManager
} from 'typeorm';
import Character from './Character';

@Entity()
class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, (character) => character.inventoryItems, {
    onDelete: 'CASCADE'
  })
  character: Character;

  @Column()
  itemId: number;

  @Column()
  inventoryType: number;

  @Column()
  position: number;

  public static async create(
    character: Character,
    inventoryType: number,
    position: number,
    itemId: number
  ): Promise<InventoryItem> {
    const item = new InventoryItem();
    item.character = character;
    item.inventoryType = inventoryType;
    item.position = position;
    item.itemId = itemId;
    return await getManager().save(InventoryItem, item);
  }
}

export default InventoryItem;

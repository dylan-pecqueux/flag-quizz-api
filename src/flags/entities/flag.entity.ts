import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country: string;

  @Column({ unique: true })
  countryCode: string;

  @Column({ nullable: true, default: null })
  description: string;
}

import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

@Entity({ name: "buyer", schema: "buyer" })
export class BuyerModel {
  @PrimaryGeneratedColumn("uuid")
  buyerId: string;

  @Column({ type: "uniqueidentifier" })
  clientId: string;

  @Column({ type: "uniqueidentifier" })
  participationStatusId: string;

  @Column({ type: "varchar", length: 50 })
  participationStatusName: string;

  @Column({ type: "varchar", length: 250, nullable: true })
  digitalId?: string;

  @Column({ type: "bit", nullable: false })
  isActive: boolean;
}

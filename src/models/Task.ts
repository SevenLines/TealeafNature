// import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
// import {Lab} from "./Lab";
//
// @Entity()
// export class Task {
//     @PrimaryGeneratedColumn()
//     id: number;
//
//
//     @Column()
//     title: string;
//
//     @ManyToOne(type => Lab, lab => lab.tasks)
//     @JoinColumn()
//     lab: string;
//
//     @Column()
//     complexity: string;
//
//     @Column()
//     content: string;
//
//     @Column()
//     additional_content: string;
//
//     @Column()
//     order: string;
//
//     @Column()
//     tags: string;
//
//     @Column()
//     visible: string;
//
//     @Column()
//     students: string;
//
//     @Column()
//     group: string;
//
//     @Column()
//     custom_class: string;
// }
import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import JobPosting from "../job-posting.model";

@Table({
    tableName: 'cat_work_model',
    timestamps: false
})
export default class CatWorkModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare id_cat_work_model: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @HasMany(() => JobPosting)
    declare jobPosting: JobPosting
}
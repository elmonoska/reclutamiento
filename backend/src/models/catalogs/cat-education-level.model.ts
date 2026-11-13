import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import JobPosting from "../job-posting.model";

@Table({
    tableName: 'cat_education_level',
    timestamps: false
})
export default class CatEducationLevel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare id_cat_education_level: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @HasMany(() => JobPosting)
    declare jobPosting: JobPosting
}
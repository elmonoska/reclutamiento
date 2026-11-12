import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import JobPosting from "../job-posting.model";

@Table({
    tableName: 'cat_experience_level',
    timestamps: false
})
export default class CatExperienceLevel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare id_cat_experience_level: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @HasMany(() => JobPosting)
    declare jobPosting: JobPosting
}
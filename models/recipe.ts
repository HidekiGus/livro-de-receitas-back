// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class Receita {
  constructor(
    public title: string,
    public ingredients: string[],
    public method: string[],
    public image?: string,
    public portions?: number,
    public time?: number,
    public id?: ObjectId
  ) {}
}

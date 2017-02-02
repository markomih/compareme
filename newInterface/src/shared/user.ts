import {Table} from "./table";
export class User {
  name: string;
  email: string;
  token: string;
  tables: Array<Table> = []
}
